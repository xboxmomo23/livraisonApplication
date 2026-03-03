package com.healdrive.service;

import com.healdrive.dto.LoginRequest;
import com.healdrive.dto.LoginResponse;
import com.healdrive.model.Utilisateur;
import com.healdrive.model.enums.RoleUtilisateur;
import com.healdrive.repository.ProfilChauffeurRepository;
import com.healdrive.repository.ProfilPatientRepository;
import com.healdrive.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final ProfilPatientRepository profilPatientRepository;
    private final ProfilChauffeurRepository profilChauffeurRepository;

    /**
     * Login simplifie pour le MVP.
     * En production : Spring Security + JWT + BCrypt.
     * Ici on verifie juste que l'email existe et on renvoie les infos.
     */
    public LoginResponse login(LoginRequest request) {
        Utilisateur user = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'email : " + request.getEmail()));

        if (!user.getActif()) {
            throw new RuntimeException("Ce compte est desactive.");
        }

        // Recuperer l'ID du profil selon le role
        UUID profilId = null;
        if (user.getRole() == RoleUtilisateur.PATIENT) {
            profilId = profilPatientRepository.findByUtilisateurId(user.getId())
                    .map(p -> p.getId())
                    .orElse(null);
        } else if (user.getRole() == RoleUtilisateur.CHAUFFEUR) {
            profilId = profilChauffeurRepository.findByUtilisateurId(user.getId())
                    .map(p -> p.getId())
                    .orElse(null);
        }

        return LoginResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .telephone(user.getTelephone())
                .role(user.getRole().name())
                .profilId(profilId)
                .build();
    }

    /**
     * Recuperer un utilisateur par son ID.
     */
    public Utilisateur getUtilisateur(UUID id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable : " + id));
    }
}
