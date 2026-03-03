package com.healdrive.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateTrajetRequest {
    private String depart;
    private String destination;
    private String date;
    private String heure;

    @JsonProperty("type_vehicule")
    private String typeVehicule;

    private UUID patientId;
}
