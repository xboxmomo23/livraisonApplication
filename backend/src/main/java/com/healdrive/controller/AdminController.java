package com.healdrive.controller;

import com.healdrive.model.Utilisateur;
import com.healdrive.model.enums.RoleUtilisateur;
import com.healdrive.repository.UtilisateurRepository;
import com.healdrive.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminController {

    private final UtilisateurRepository utilisateurRepository;
    private final EmailService emailService;

    @GetMapping("/chauffeurs/en-attente")
    public ResponseEntity<List<Map<String, Object>>> getChauffeursEnAttente() {
        List<Map<String, Object>> result = utilisateurRepository
                .findByRoleAndStatutCompteOrderByDateCreationAsc(RoleUtilisateur.CHAUFFEUR, "EN_ATTENTE")
                .stream()
                .map(this::toAdminRow)
                .toList();
        return ResponseEntity.ok(result);
    }

    @PutMapping("/chauffeurs/{id}/valider")
    public ResponseEntity<?> validerChauffeur(@PathVariable UUID id) {
        try {
            Utilisateur utilisateur = utilisateurRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable : " + id));

            if (utilisateur.getRole() != RoleUtilisateur.CHAUFFEUR) {
                throw new RuntimeException("Cet utilisateur n'est pas un chauffeur.");
            }

            utilisateur.setStatutCompte("ACTIF");
            utilisateur.setActif(true);
            utilisateurRepository.save(utilisateur);
            emailService.envoyerValidationCompte(utilisateur.getEmail());

            return ResponseEntity.ok(Map.of(
                    "message", "Chauffeur valide avec succes.",
                    "id", utilisateur.getId(),
                    "statutCompte", utilisateur.getStatutCompte()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private Map<String, Object> toAdminRow(Utilisateur u) {
        return Map.of(
                "id", u.getId(),
                "nom", u.getNom(),
                "prenom", u.getPrenom(),
                "email", u.getEmail(),
                "telephone", u.getTelephone(),
                "role", u.getRole().name(),
                "statutCompte", u.getStatutCompte(),
                "dateCreation", u.getDateCreation()
        );
    }
}
