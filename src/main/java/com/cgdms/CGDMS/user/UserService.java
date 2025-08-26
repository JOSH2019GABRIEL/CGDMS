package com.cgdms.CGDMS.user;

import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.email.EmailService;
import com.cgdms.CGDMS.email.EmailTemplateName;
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

    @Value("${application.mailing.frontend.activation-url}")
    private String activationUrl;


    public void register(RegistrationRequest request) throws MessagingException {

        var userRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() -> new IllegalStateException("ROLE ADMIN was not initialized"));
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .cadre(request.getCadre())
                .phone(request.getPhone())
                .email(request.getEmail())
                .dateOfBirth(request.getDateOfBirth())
                .password(passwordEncoder.encode(request.getPassword()))
                .accountLocked(false)
                .enabled(false)
                .roles(List.of(userRole))
                .build();
        userRepository.save(user);
        sendValidationEmail(user);

    }

    private void sendValidationEmail(User user) throws MessagingException {

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

//    public PageResponse<UserResponse> findAllStaff(int page, int size) {
//
//        Pageable pageable = PageRequest.of(page, size, Sort.by("createDate").descending());
//        Page<User> users = userRepository.findAllUsers(pageable);
//        List<UserResponse> userResponses =
//                users.stream()
//                        .map(userMapperService::toUserResponse)
//                        .toList();
//
//        return new PageResponse<>(
//                userResponses,
//                users.getNumber(),
//                users.getSize(),
//                users.getTotalElements(),
//                users.isFirst(),
//                users.isLast()
//        );
//    }


    public PageResponse<UserResponse> findAllStaff(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<User> users = userRepository.findAllUsers(pageable); // or findAllUsers if you need custom filtering

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

        // If USER is not ADMIN and trying to update someone else
        boolean isAdmin = loggedInUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ADMIN"));
        if (!isAdmin && !loggedInUser.getId().equals(user.getId())) {
            throw new SecurityException("You are not allowed to update this user");
        }

        // Fields USER can update
        if (request.getFirstname() != null) user.setFirstname(request.getFirstname());
        if (request.getLastname() != null) user.setLastname(request.getLastname());
        if (request.getCadre() != null) user.setCadre(request.getCadre());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getDateOfBirth() != null) user.setDateOfBirth(request.getDateOfBirth());

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
                .cadre(savedUser.getCadre())
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
    public void adminResetPassword(Integer userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void deleteUser(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not found"));
        user.setArchived(1);
        userRepository.save(user);

    }

}
