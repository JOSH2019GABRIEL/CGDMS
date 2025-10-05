package com.cgdms.CGDMS.cadre;


import org.springframework.stereotype.Service;

@Service
public class CadreMapperService {

    public Cadre toEntity(CadreRequest request) {
        if (request == null) return null;

        Cadre cadre = new Cadre();
        cadre.setCadreName(request.getCadreName());
        cadre.setPaymentType(request.getPaymentType());
        cadre.setRate(request.getRate());
        cadre.setDescription(request.getDescription());

        return cadre;
    }

    public CadreResponse toResponse(Cadre cadre) {
        if (cadre == null) return null;

        double estimatedDaily = 0.0;
        double estimatedMonthly = 0.0;

        switch (cadre.getPaymentType()) {
            case HOURLY -> {
                estimatedDaily = cadre.getRate() * 8;   // assume 8 hours per day
                estimatedMonthly = estimatedDaily * 26; // assume 26 workdays
            }
            case DAILY -> {
                estimatedDaily = cadre.getRate();
                estimatedMonthly = cadre.getRate() * 26;
            }
            case MONTHLY -> {
                estimatedMonthly = cadre.getRate();
                estimatedDaily = cadre.getRate() / 26;
            }
        }

        return CadreResponse.builder()
                .id(cadre.getId())
                .cadreName(cadre.getCadreName())
                .paymentType(cadre.getPaymentType())
                .rate(cadre.getRate())
                .description(cadre.getDescription())
                .farmId(cadre.getFarm() != null ? cadre.getFarm().getId() : null)
                .farmName(cadre.getFarm() != null ? cadre.getFarm().getFarmName() : null)
                .estimatedDailyPay(estimatedDaily)
                .estimatedMonthlyPay(estimatedMonthly)
                .build();
    }
}