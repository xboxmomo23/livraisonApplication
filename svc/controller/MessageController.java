package com.healdrive.controller;

import com.healdrive.dto.MessageRequest;
import com.healdrive.dto.MessageResponse;
import com.healdrive.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/messages")
@CrossOrigin("*")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    /**
     * GET /api/messages/trajet/{trajetId}
     * Tous les messages d'un trajet.
     */
    @GetMapping("/trajet/{trajetId}")
    public ResponseEntity<List<MessageResponse>> getMessages(@PathVariable UUID trajetId) {
        return ResponseEntity.ok(messageService.getMessages(trajetId));
    }

    /**
     * POST /api/messages/trajet/{trajetId}
     * Envoyer un message.
     * Body : { "expediteurId": "...", "contenu": "..." }
     */
    @PostMapping("/trajet/{trajetId}")
    public ResponseEntity<MessageResponse> envoyerMessage(
            @PathVariable UUID trajetId,
            @RequestBody MessageRequest request) {
        return ResponseEntity.ok(messageService.envoyerMessage(trajetId, request));
    }

    /**
     * PUT /api/messages/trajet/{trajetId}/lus?userId=...
     * Marquer les messages comme lus.
     */
    @PutMapping("/trajet/{trajetId}/lus")
    public ResponseEntity<Void> marquerLus(
            @PathVariable UUID trajetId,
            @RequestParam UUID userId) {
        messageService.marquerLus(trajetId, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/messages/trajet/{trajetId}/non-lus?userId=...
     * Compter les messages non lus.
     */
    @GetMapping("/trajet/{trajetId}/non-lus")
    public ResponseEntity<Long> compterNonLus(
            @PathVariable UUID trajetId,
            @RequestParam UUID userId) {
        return ResponseEntity.ok(messageService.compterNonLus(trajetId, userId));
    }
}
