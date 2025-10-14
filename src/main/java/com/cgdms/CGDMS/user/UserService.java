package com.cgdms.CGDMS.user;

import com.cgdms.CGDMS.cadre.Cadre;
import com.cgdms.CGDMS.cadre.CadreRepository;
import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.email.EmailService;
import com.cgdms.CGDMS.email.EmailTemplateName;
import com.cgdms.CGDMS.farm.FarmRepository;
import com.cgdms.CGDMS.role.RoleRepository;
import com.cgdms.CGDMS.security.JWTService;
import com.cgdms.CGDMS.token.Token;
import com.cgdms.CGDMS.token.TokenRepository;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;


@Service
public class UserService {

    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private CadreRepository cadreRepository;
    @Autowired
    private FarmRepository farmRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TokenRepository tokenRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private UserMapperService userMapperService;

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JWTService jwtService;
    @Autowired
    private AuthUtils authUtils;

    @Value("${application.mailing.frontend.activation-url}")
    private String activationUrl;

    private final static String DEFAULT_PASSWORD = "defaultPassword";


    public void register(RegistrationRequest request) throws MessagingException {
        String emailLowerCase = request.getEmail().toLowerCase();
        var userRole = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new IllegalStateException("ROLE was not initialized"));
        var userFarm = farmRepository.findById(request.getFarmId())
                .orElseThrow(() -> new IllegalStateException("FARM was not initialized"));

        Cadre cadre = cadreRepository.findById(request.getCadreId())
                .orElseThrow(() -> new IllegalStateException("Cadre not found with ID: " + request.getCadreId()));

        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .cadre(cadre)
                .phone(request.getPhone())
                .email(emailLowerCase)
                .dateOfBirth(request.getDateOfBirth())
                .password(passwordEncoder.encode(request.getPassword()))
                .accountLocked(false)
                .enabled(true)
                .archived(0)
                .role(userRole)
                .farm(userFarm)
                .build();
        userRepository.save(user);
//        sendValidationEmail(user);
    }


    public void sendValidationEmail(User user) throws MessagingException {

        var newToken = generateAndSaveActivationToken(user);
//        send mail
        emailService.sendEmail(
                user.getEmail(),
                user.fullName(),
                EmailTemplateName.ACTIVATE_ACCOUNT,
                activationUrl,
                newToken,
                "account activation"

        );

    }

    private String generateAndSaveActivationToken(User user) {
        //generate a token
        String generatedToken = generateActivationCode (6);
        var token = Token.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();

        tokenRepository.save(token);
        return generatedToken;
    }

    private String generateActivationCode(int length) {

        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();
        SecureRandom secureRandom = new SecureRandom();
        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }
        return codeBuilder.toString();
    }

    public void activateAccount(String token) throws MessagingException {

        Token savedToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())){
            sendValidationEmail(savedToken.getUser());
            throw new RuntimeException("Activation token has expired. A new token has been sent to the same email address");
        }
        var user = userRepository.findById(savedToken.getUser().getId())
                .orElseThrow(()-> new UsernameNotFoundException("User not found"));
        user.setEnabled(true);
        userRepository.save(user);
        savedToken.setValidatedAt(LocalDateTime.now());
        tokenRepository.save(savedToken);
    }

    public UserResponse findById(Integer staffId) {
        return userRepository.findById(staffId)
                .map(userMapperService::toUserResponse)
                .orElseThrow(()-> new EntityNotFoundException("No Staff with the ID: " + staffId));
    }


    public PageResponse<UserResponse> findAllStaff(int page, int size) {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<User> users = isAdmin ? userRepository.findAllUsers(pageable, farmId) : userRepository.findAllNotArchivedForUsers(pageable, farmId, loggedInUser.getId());

        List<UserResponse> userResponses = users.stream()
                .map(userMapperService::toUserResponse)
                .toList();

        return new PageResponse<>(
                userResponses,
                users.getNumber(),
                users.getSize(),
                users.getTotalElements(),
                users.getTotalPages(),
                users.isFirst(),
                users.isLast()
        );
    }

    public UserResponse updateUser(Integer id, UpdateUserRequest request, User loggedInUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));

        Cadre cadre = cadreRepository.findById(request.getCadreId())
                .orElseThrow(() -> new IllegalStateException("Cadre not found with ID: " + request.getCadreId()));

        // If USER is not ADMIN and trying to update someone else
        boolean isAdmin = loggedInUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN") || auth.getAuthority().equals("ROLE_USER"));
        if (!isAdmin && !loggedInUser.getId().equals(user.getId())) {
            throw new SecurityException("You are not allowed to update this user");
        }

        // Fields USER can update
        if (request.getFirstname() != null) user.setFirstname(request.getFirstname());
        if (request.getLastname() != null) user.setLastname(request.getLastname());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getDateOfBirth() != null) user.setDateOfBirth(request.getDateOfBirth());
        if (request.getCadreId() != null) user.setCadre(cadre);


        // Only ADMIN can enable/disable
//        if (isAdmin && request.getEnabled() != null) {
//            user.setEnabled(request.getEnabled());
//        }

        User savedUser = userRepository.save(user);

        return UserResponse.builder()
                .id(savedUser.getId())
                .firstname(savedUser.getFirstname())
                .lastname(savedUser.getLastname())
                .email(savedUser.getEmail())
                .cadreId(savedUser.getCadre() != null ? savedUser.getCadre().getId() : null)
                .cadre(savedUser.getCadre() != null ? savedUser.getCadre().getCadreName() : null)
                .phone(savedUser.getPhone())
                .dateOfBirth(savedUser.getDateOfBirth())
//                .enabled(savedUser.isEnabled())
                .build();
    }

    public void changePassword(User loggedInUser, ChangePasswordRequest request) {
        // validate old password
        if (!passwordEncoder.matches(request.getOldPassword(), loggedInUser.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // encode and save new password
        loggedInUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(loggedInUser);
    }

    // Optional: ADMIN can reset user password without old one
    public void adminResetPassword(String userEmail, String newPassword) {
        String cleanEmail = userEmail.toLowerCase();
        newPassword = passwordEncoder.encode(DEFAULT_PASSWORD);
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void userResetPassword(String userEmail) {
        String cleanEmail = userEmail.toLowerCase();
        String newPassword = passwordEncoder.encode(DEFAULT_PASSWORD);
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        //boolean matches = passwordEncoder.matches(DEFAULT_PASSWORD, newPassword);
        user.setPassword(newPassword);
        userRepository.save(user);
    }

    public void deleteUser(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not found"));
        user.setArchived(1);
        userRepository.save(user);

    }

    public Integer totalNumberOfUsers() {
        Long farmId = authUtils.getCurrentUserFarmId();

        return userRepository.findAllCount(farmId);
    }

}
