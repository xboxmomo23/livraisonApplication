package com.healdrive.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private UUID id;
    private UUID trajetId;
    private UUID expediteurId;
    private String expediteurNom;
    private String expediteurPrenom;
    private String expediteurRole;
    private String contenu;
    private Boolean lu;
    private OffsetDateTime dateEnvoi;
}
