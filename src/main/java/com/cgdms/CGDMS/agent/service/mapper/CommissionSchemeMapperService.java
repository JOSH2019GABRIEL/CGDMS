//package com.cgdms.CGDMS.agent.service.mapper;
//
//import com.cgdms.CGDMS.agent.entity.CommissionScheme;
//import com.cgdms.CGDMS.agent.entity.CommissionSchemeRule;
//import com.cgdms.CGDMS.agent.entity.request.CommissionSchemeRequest;
//import com.cgdms.CGDMS.agent.entity.response.CommissionRuleResponse;
//import com.cgdms.CGDMS.agent.entity.response.CommissionSchemeResponse;
//import org.springframework.stereotype.Service;
//import java.util.stream.Collectors;
//
//@Service
//public class CommissionSchemeMapperService {
//
//    public CommissionScheme toCommissionScheme(CommissionSchemeRequest request) {
//        return CommissionScheme.builder()
//                .schemeName(request.getSchemeName())
//                .description(request.getDescription())
//                .isActive(request.getIsActive())
//                .build();
//    }
//
//    public CommissionSchemeResponse toCommissionSchemeResponse(CommissionScheme scheme) {
//        CommissionSchemeResponse response = new CommissionSchemeResponse();
//        response.setCommissionSchemeId(scheme.getId());
//        response.setSchemeName(scheme.getSchemeName());
//        response.setDescription(scheme.getDescription());
//        response.setIsActive(scheme.getIsActive());
//        if (scheme.getRules() != null) {
//            response.setRules(scheme.getRules().stream()
//                    .map(this::toCommissionRuleResponse)
//                    .collect(Collectors.toList()));
//        }
//        return response;
//    }
//
//    private CommissionRuleResponse toCommissionRuleResponse(CommissionSchemeRule rule) {
//        CommissionRuleResponse resp = new CommissionRuleResponse();
////        resp.setRuleId(rule.getRuleId());
//        resp.setCommissionSchemeId(rule.getCommissionScheme().getId());
//        resp.setProductId(rule.getProduct() != null ? rule.getProduct().getId() : null);
//        resp.setMinQty(rule.getMinQty());
//        resp.setMaxQty(rule.getMaxQty());
////        resp.setCommissionType(rule.getCommissionType());
//        resp.setCommissionValue(rule.getCommissionValue());
//        return resp;
//    }
//}