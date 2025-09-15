package com.cgdms.CGDMS.logs.env;

import com.cgdms.CGDMS.pond.Pond;
import com.cgdms.CGDMS.pond.PondRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EnvLogMapper {

    private final PondRepository pondRepository;

    public EnvLog toEntity(EnvLogRequest r) {
        EnvLog e = EnvLog.builder()
                .measuredAt(r.getMeasuredAt())
                .temperatureC(r.getTemperatureC())
                .dissolvedOxygenMgL(r.getDissolvedOxygenMgL())
                .pH(r.getPH())
                .ammoniaMgL(r.getAmmoniaMgL())
                .turbidityNtu(r.getTurbidityNtu())
                .salinityPpt(r.getSalinityPpt())
                .notes(r.getNotes())
                .fromSensor(Boolean.TRUE.equals(r.getFromSensor()))
                .archived(0)
                .build();

        Pond pond = pondRepository.findById(r.getPondId())
                .orElseThrow(() -> new IllegalArgumentException("Pond not found with id: " + r.getPondId()));
        e.setPond(pond);

        return e;
    }

    public void applyUpdate(EnvLog target, EnvLogRequest r) {
        if (r.getMeasuredAt() != null) target.setMeasuredAt(r.getMeasuredAt());
        if (r.getTemperatureC() != null) target.setTemperatureC(r.getTemperatureC());
        if (r.getDissolvedOxygenMgL() != null) target.setDissolvedOxygenMgL(r.getDissolvedOxygenMgL());
        if (r.getPH() != null) target.setPH(r.getPH());
        if (r.getAmmoniaMgL() != null) target.setAmmoniaMgL(r.getAmmoniaMgL());
        if (r.getTurbidityNtu() != null) target.setTurbidityNtu(r.getTurbidityNtu());
        if (r.getSalinityPpt() != null) target.setSalinityPpt(r.getSalinityPpt());
        if (r.getFromSensor() != null) target.setFromSensor(r.getFromSensor());
        if (r.getNotes() != null) target.setNotes(r.getNotes());
        if (r.getPondId() != null) {
            Pond pond = pondRepository.findById(r.getPondId())
                    .orElseThrow(() -> new IllegalArgumentException("Pond not found with id: " + r.getPondId()));
            target.setPond(pond);
        }
    }

    public EnvLogResponse toResponse(EnvLog e) {
        return EnvLogResponse.builder()
                .id(e.getId())
                .pondId(e.getPond() != null ? e.getPond().getId() : null)
                .pondName(e.getPond() != null ? e.getPond().getName() : null)
                .measuredAt(e.getMeasuredAt())
                .temperatureC(e.getTemperatureC())
                .dissolvedOxygenMgL(e.getDissolvedOxygenMgL())
                .pH(e.getPH())
                .ammoniaMgL(e.getAmmoniaMgL())
                .turbidityNtu(e.getTurbidityNtu())
                .salinityPpt(e.getSalinityPpt())
                .fromSensor(e.getFromSensor())
                .notes(e.getNotes())
                .build();
    }
}