package com.healdrive.service;

import com.healdrive.dto.MessageRequest;
import com.healdrive.dto.MessageResponse;
import com.healdrive.model.Message;
import com.healdrive.model.Trajet;
import com.healdrive.model.Utilisateur;
import com.healdrive.model.enums.TypeNotification;
import com.healdrive.repository.MessageRepository;
import com.healdrive.repository.TrajetRepository;
import com.healdrive.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final TrajetRepository trajetRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final NotificationService notificationService;

    /**
     * Recuperer tous les messages d'un trajet.
     */
    public List<MessageResponse> getMessages(UUID trajetId) {
        return messageRepository.findByTrajetIdOrderByDateEnvoiAsc(trajetId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Envoyer un message dans le chat d'un trajet.
     */
    @Transactional
    public MessageResponse envoyerMessage(UUID trajetId, MessageRequest request) {
        Trajet trajet = trajetRepository.findById(trajetId)
                .orElseThrow(() -> new RuntimeException("Trajet introuvable : " + trajetId));

        Utilisateur expediteur = utilisateurRepository.findById(request.getExpediteurId())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable : " + request.getExpediteurId()));

        Message message = Message.builder()
                .trajet(trajet)
                .expediteur(expediteur)
                .contenu(request.getContenu())
                .lu(false)
                .build();

        message = messageRepository.save(message);

        Utilisateur patientUser = trajet.getPatient() != null ? trajet.getPatient().getUtilisateur() : null;
        Utilisateur chauffeurUser = trajet.getChauffeur() != null ? trajet.getChauffeur().getUtilisateur() : null;
        UUID destinataireId = null;

        if (patientUser != null && !patientUser.getId().equals(expediteur.getId())) {
            destinataireId = patientUser.getId();
        } else if (chauffeurUser != null && !chauffeurUser.getId().equals(expediteur.getId())) {
            destinataireId = chauffeurUser.getId();
        }

        if (destinataireId != null) {
            notificationService.creerNotification(
                    destinataireId,
                    TypeNotification.NOUVEAU_MESSAGE,
                    "Nouveau message",
                    "Vous avez recu un nouveau message sur votre trajet.",
                    trajet
            );
        }

        return toResponse(message);
    }

    /**
     * Marquer les messages comme lus.
     */
    @Transactional
    public void marquerLus(UUID trajetId, UUID userId) {
        messageRepository.markAsReadByTrajetAndUser(trajetId, userId);
    }

    /**
     * Compter les messages non lus.
     */
    public long compterNonLus(UUID trajetId, UUID userId) {
        return messageRepository.countUnreadByTrajetAndUser(trajetId, userId);
    }

    private MessageResponse toResponse(Message m) {
        Utilisateur exp = m.getExpediteur();
        return MessageResponse.builder()
                .id(m.getId())
                .trajetId(m.getTrajet().getId())
                .expediteurId(exp.getId())
                .expediteurNom(exp.getNom())
                .expediteurPrenom(exp.getPrenom())
                .expediteurRole(exp.getRole().name())
                .contenu(m.getContenu())
                .lu(m.getLu())
                .dateEnvoi(m.getDateEnvoi())
                .build();
    }
}
