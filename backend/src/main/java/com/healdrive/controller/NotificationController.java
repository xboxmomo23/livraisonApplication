package com.healdrive.controller;

import com.healdrive.dto.NotificationResponse;
import com.healdrive.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/utilisateur/{userId}")
    public ResponseEntity<List<NotificationResponse>> getNotificationsUtilisateur(@PathVariable UUID userId) {
        return ResponseEntity.ok(notificationService.getNotificationsUtilisateur(userId));
    }

    @GetMapping("/utilisateur/{userId}/unread/count")
    public ResponseEntity<Long> countUnread(@PathVariable UUID userId) {
        return ResponseEntity.ok(notificationService.countUnread(userId));
    }

    @PutMapping("/{id}/lu")
    public ResponseEntity<Void> marquerCommeLue(@PathVariable UUID id) {
        notificationService.marquerCommeLue(id);
        return ResponseEntity.noContent().build();
    }
}
