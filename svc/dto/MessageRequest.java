package com.healdrive.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class MessageRequest {
    private UUID expediteurId;
    private String contenu;
}
