package com.cgdms.CGDMS.agent.service.mapper;

import com.cgdms.CGDMS.agent.entity.CommissionScheme;
import com.cgdms.CGDMS.agent.entity.CommissionSchemeRule;
import com.cgdms.CGDMS.agent.entity.Product;
import com.cgdms.CGDMS.agent.entity.request.CommissionSchemeRequest;
import com.cgdms.CGDMS.agent.entity.response.CommissionRuleResponse;
import com.cgdms.CGDMS.agent.entity.response.CommissionSchemeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommissionSchemeMapperService {

    public CommissionScheme toEntity(CommissionSchemeRequest request) {

        CommissionScheme scheme = CommissionScheme.builder()
                .schemeName(request.getSchemeName())
                .description(request.getDescription())
                .isActive(request.getIsActive())
                .archived(0)
                .build();

        if (request.getRules() != null && !request.getRules().isEmpty()) {

            List<CommissionSchemeRule> rules = request.getRules().stream()
                    .map(ruleReq -> {

                        Product product = null;

                        // If product exists, fetch or set stub object
                        if (ruleReq.getProductId() != null) {
                            product = Product.builder()
                                    .id(ruleReq.getProductId())
                                    .build();
                        }
                        return CommissionSchemeRule.builder()
                                .product(product)
                                .minQty(ruleReq.getMinQty())
                                .maxQty(ruleReq.getMaxQty())
                                .commissionType(ruleReq.getCommissionType())
                                .commissionValue(ruleReq.getCommissionValue())
                                .commissionScheme(scheme) // IMPORTANT
                                .archived(0)
                                .build();
                    })
                    .collect(Collectors.toList());

            scheme.setRules(rules);
        }

        return scheme;
    }


    public CommissionSchemeResponse toCommissionSchemeResponse(CommissionScheme scheme) {
        CommissionSchemeResponse response = new CommissionSchemeResponse();

        response.setId(scheme.getId());
        response.setSchemeName(scheme.getSchemeName());
        response.setDescription(scheme.getDescription());
        response.setIsActive(scheme.getIsActive());

        if (scheme.getRules() != null) {
            response.setRules(
                    scheme.getRules().stream()
                            .map(this::toCommissionRuleResponse)
                            .collect(Collectors.toList())
            );
        }

        return response;
    }

    private CommissionRuleResponse toCommissionRuleResponse(CommissionSchemeRule rule) {
        if (rule == null) return null;

        return CommissionRuleResponse.builder()
                .id(rule.getId())
                .productId(rule.getProduct() != null ? rule.getProduct().getId() : null)
                .minQty(rule.getMinQty())
                .maxQty(rule.getMaxQty())
                .commissionType(rule.getCommissionType())
                .commissionValue(rule.getCommissionValue())
                .commissionSchemeId(rule.getCommissionScheme().getId())
                .build();
    }
}