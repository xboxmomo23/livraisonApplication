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
public class NotificationResponse {
    private UUID id;
    private String type;
    private String titre;
    private String contenu;
    private Boolean lu;
    private OffsetDateTime dateCreation;
    private UUID trajetId;
}
