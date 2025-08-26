package com.cgdms.CGDMS.pond;

import org.springframework.stereotype.Service;

@Service
public class PondMapperService {

    public Pond toPond(PondRequest pondRequest) {
        return Pond.builder()
                .id(pondRequest.getId())
                .name(pondRequest.getName())
                .capacity(pondRequest.getCapacity())
                .location(pondRequest.getLocation())
                .status(pondRequest.getStatus())
//                .archived()
                .build();
    }

    public PondResponse toPondResponse(Pond pond) {
        return PondResponse.builder()
                .id(pond.getId())
                .name(pond.getName())
                .capacity(pond.getCapacity())
                .location(pond.getLocation())
                .status(pond.getStatus())
                .archived(pond.getArchived())
                .build();
    }
}
