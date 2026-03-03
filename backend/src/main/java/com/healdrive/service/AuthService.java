package com.healdrive.service;

import com.healdrive.dto.LoginRequest;
import com.healdrive.dto.LoginResponse;
import com.healdrive.dto.RegisterRequest;
import com.healdrive.model.ProfilChauffeur;
import com.healdrive.model.ProfilPatient;
import com.healdrive.model.Utilisateur;
import com.healdrive.model.Vehicule;
import com.healdrive.model.enums.RoleUtilisateur;
import com.healdrive.model.enums.TypeVehicule;
import com.healdrive.repository.ProfilChauffeurRepository;
import com.healdrive.repository.ProfilPatientRepository;
import com.healdrive.repository.UtilisateurRepository;
import com.healdrive.repository.VehiculeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final ProfilPatientRepository profilPatientRepository;
    private final ProfilChauffeurRepository profilChauffeurRepository;
    private final VehiculeRepository vehiculeRepository;

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
     * Inscription utilisateur.
     */
    public LoginResponse register(RegisterRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Un compte existe deja avec cet email.");
        }

        RoleUtilisateur role = RoleUtilisateur.valueOf(request.getRole().trim().toUpperCase(Locale.ROOT));

        Utilisateur user = Utilisateur.builder()
                .id(UUID.randomUUID())
                .email(request.getEmail().trim())
                .motDePasse(request.getMotDePasse())
                .nom(request.getNom().trim())
                .prenom(request.getPrenom().trim())
                .telephone(request.getTelephone())
                .role(role)
                .actif(true)
                .build();

        Utilisateur saved = utilisateurRepository.save(user);

        UUID profilId = null;
        if (role == RoleUtilisateur.PATIENT) {
            ProfilPatient profilPatient = ProfilPatient.builder()
                    .utilisateur(saved)
                    .numeroSecu(("TMP" + saved.getId().toString().replace("-", "")).substring(0, 21))
                    .regime("Regime general")
                    .build();
            profilId = profilPatientRepository.save(profilPatient).getId();
        } else if (role == RoleUtilisateur.CHAUFFEUR) {
            ProfilChauffeur profilChauffeur = ProfilChauffeur.builder()
                    .utilisateur(saved)
                    .numeroAgrementCpam("TMP-CPAM-" + saved.getId().toString().substring(0, 8))
                    .zoneGeo("Paris et Ile-de-France")
                    .disponible(true)
                    .build();
            ProfilChauffeur savedProfil = profilChauffeurRepository.save(profilChauffeur);
            profilId = savedProfil.getId();

            Vehicule vehicule = Vehicule.builder()
                    .chauffeur(savedProfil)
                    .type(TypeVehicule.VSL)
                    .immatriculation(("TMP" + saved.getId().toString().replace("-", "")).substring(0, 12).toUpperCase(Locale.ROOT))
                    .marque("Renault")
                    .modele("Kangoo")
                    .actif(true)
                    .build();
            vehiculeRepository.save(vehicule);
        }

        return LoginResponse.builder()
                .id(saved.getId())
                .email(saved.getEmail())
                .nom(saved.getNom())
                .prenom(saved.getPrenom())
                .telephone(saved.getTelephone())
                .role(saved.getRole().name())
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
