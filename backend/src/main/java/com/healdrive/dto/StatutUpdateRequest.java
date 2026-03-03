package com.healdrive.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class StatutUpdateRequest {
    private String nouveauStatut;
    private UUID chauffeurId;
    private String commentaire;
}
