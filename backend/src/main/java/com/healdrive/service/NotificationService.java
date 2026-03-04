package com.healdrive.service;

import com.healdrive.dto.NotificationResponse;
import com.healdrive.model.Notification;
import com.healdrive.model.Trajet;
import com.healdrive.model.Utilisateur;
import com.healdrive.model.enums.TypeNotification;
import com.healdrive.repository.NotificationRepository;
import com.healdrive.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UtilisateurRepository utilisateurRepository;

    public List<NotificationResponse> getNotificationsUtilisateur(UUID userId) {
        return notificationRepository.findByUtilisateurIdOrderByDateCreationDesc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public long countUnread(UUID userId) {
        return notificationRepository.countByUtilisateurIdAndLuFalse(userId);
    }

    @Transactional
    public void marquerCommeLue(UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification introuvable : " + notificationId));
        notification.setLu(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public NotificationResponse creerNotification(
            UUID userId,
            TypeNotification type,
            String titre,
            String contenu,
            Trajet trajet
    ) {
        Utilisateur utilisateur = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable : " + userId));

        Notification notification = Notification.builder()
                .utilisateur(utilisateur)
                .type(type)
                .titre(titre)
                .contenu(contenu)
                .trajet(trajet)
                .lu(false)
                .build();

        return toResponse(notificationRepository.save(notification));
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .type(n.getType().name())
                .titre(n.getTitre())
                .contenu(n.getContenu())
                .lu(n.getLu())
                .dateCreation(n.getDateCreation())
                .trajetId(n.getTrajet() != null ? n.getTrajet().getId() : null)
                .build();
    }
}
