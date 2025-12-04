package com.cgdms.CGDMS.agent.service;


import com.cgdms.CGDMS.agent.entity.CommissionScheme;
import com.cgdms.CGDMS.agent.entity.CommissionSchemeRule;
import com.cgdms.CGDMS.agent.entity.OrderItem;
import com.cgdms.CGDMS.agent.entity.Product;
import com.cgdms.CGDMS.agent.entity.request.CommissionSchemeRequest;
import com.cgdms.CGDMS.agent.entity.response.CommissionSchemeResponse;
import com.cgdms.CGDMS.agent.entity.response.ProductResponse;
import com.cgdms.CGDMS.agent.repository.CommissionRuleRepository;
import com.cgdms.CGDMS.agent.repository.CommissionSchemeRepository;
import com.cgdms.CGDMS.agent.repository.ProductRepository;
import com.cgdms.CGDMS.agent.service.mapper.CommissionSchemeMapperService;
import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.user.User;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommisionSchemeService {

    private final CommissionSchemeRepository schemeRepository;
    private final CommissionRuleRepository ruleRepository;
    private final CommissionSchemeMapperService mapper;
    private final ProductRepository productRepository;
    private final AuthUtils authUtils;

    @Transactional
    public CommissionSchemeResponse createScheme(CommissionSchemeRequest request) throws BadRequestException {
        // Validate name uniqueness
        schemeRepository.findBySchemeName(request.getSchemeName()).ifPresent(s -> {
            try {
                throw new EntityExistsException("A scheme with this name already exists");
            } catch (EntityExistsException e) {
                throw new RuntimeException(e);
            }
        });

        // Validate rules
        validateRules(request);

        CommissionScheme scheme = mapper.toEntity(request);
        CommissionScheme saved = schemeRepository.save(scheme);
        return mapper.toCommissionSchemeResponse(saved);
    }

    @Transactional
    public CommissionSchemeResponse updateScheme(Long id, CommissionSchemeRequest request) throws BadRequestException {

        CommissionScheme existing = schemeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "CommissionScheme not found: " + id
                ));

        // Validate incoming rule data
        validateRules(request);

        // Update basic fields
        existing.setSchemeName(request.getSchemeName());
        existing.setDescription(request.getDescription());
        existing.setIsActive(request.getIsActive());

        // Build new rule list
        List<?> newRules = request.getRules() == null
                ? List.of()
                : request.getRules().stream().map(r -> {

            Product product = null;
            if (r.getProductId() != null) {
                product = productRepository.findById(r.getProductId())
                        .orElseThrow(() -> new EntityNotFoundException(
                                "Product not found: " + r.getProductId()
                        ));
            }

            return CommissionSchemeRule.builder()
                    .product(product)
                    .minQty(r.getMinQty())
                    .maxQty(r.getMaxQty())
                    .commissionType(r.getCommissionType())
                    .commissionValue(r.getCommissionValue())
                    .commissionScheme(existing)
                    .build();

        }).toList();

        // Remove old and add new (safe for JPA)
        existing.getRules().clear();
        existing.getRules().addAll((Collection<? extends CommissionSchemeRule>) newRules);

        // Save parent
        CommissionScheme saved = schemeRepository.save(existing);
        return mapper.toCommissionSchemeResponse(saved);
    }



    public CommissionSchemeResponse getById(Long id) {
        return mapper.toCommissionSchemeResponse(schemeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("CommissionScheme not found")));
    }

    public List<CommissionSchemeResponse> listAll() {
        return schemeRepository.findAll().stream().map(mapper::toCommissionSchemeResponse).toList();
    }

    public PageResponse<CommissionSchemeResponse> findAllScheme(int page, int size) {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<CommissionScheme> commissionSchemes = isAdmin ? schemeRepository.findAllNotArchived(pageable, farmId) : schemeRepository.findAllNotArchivedForUsers(pageable, farmId, loggedInUser.getId());

        List<CommissionSchemeResponse> responses = commissionSchemes.stream()
                .map(mapper::toCommissionSchemeResponse)
                .toList();
        return new PageResponse<>(
                responses,
                commissionSchemes.getNumber(),
                commissionSchemes.getSize(),
                commissionSchemes.getTotalElements(),
                commissionSchemes.getTotalPages(),
                commissionSchemes.isFirst(),
                commissionSchemes.isLast()
        );
    }

    @Transactional
    public void delete(Long id) {
        CommissionScheme existing = schemeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("CommissionScheme not found"));

        existing.setArchived(1);
        schemeRepository.save(existing);
    }

    private void validateRules(CommissionSchemeRequest request) throws BadRequestException {
        if (request.getRules() == null) return;

        for (var r : request.getRules()) {
            if (r.getMinQty() != null && r.getMaxQty() != null && r.getMinQty() > r.getMaxQty()) {
                throw new BadRequestException("Rule minQty cannot be greater than maxQty");
            }
            if (r.getCommissionValue() == null) {
                throw new BadRequestException("commissionValue is required for all rules");
            }
            if (CommissionSchemeRule.CommissionType.PERCENTAGE.equals(r.getCommissionType())) {
                if (r.getCommissionValue().doubleValue() < 0 || r.getCommissionValue().doubleValue() > 100) {
                    throw new BadRequestException("percentage must be between 0 and 100");
                }
//            } else if ("FLAT".equalsIgnoreCase(r.getCommissionType())) {
//                if (r.getCommissionValue().doubleValue() < 0) {
//                    throw new BadRequestException("commissionValue cannot be negative");
//                }
            } else {
                throw new BadRequestException("Unknown commissionType: " + r.getCommissionType());
            }
        }
    }

    // apply commision
    public Double applyCommission(Long productId, Integer quantity, double totalPrice) throws BadRequestException {
        if (productId == null || quantity == null) {
            throw new BadRequestException("Product ID and quantity cannot be null");
        }
        CommissionSchemeRule rule = ruleRepository
                .findRuleForProductAndQty(productId, quantity)
                .orElseThrow(() -> new BadRequestException(
                        "No commission rule found for product " + productId + " and qty " + quantity
                ));

        double commissionAmount;
        if (rule.getCommissionType() == CommissionSchemeRule.CommissionType.PERCENTAGE) {
            commissionAmount = (totalPrice * rule.getCommissionValue()) / 100;
        } else if (rule.getCommissionType() == CommissionSchemeRule.CommissionType.PER_UNIT) {
            commissionAmount = rule.getCommissionValue() * quantity;
        } else {
            throw new BadRequestException("Unknown commission type");
        }
        return commissionAmount;
    }

}
