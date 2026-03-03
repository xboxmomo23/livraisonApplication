package com.healdrive.controller;

import com.healdrive.dto.DashboardStats;
import com.healdrive.dto.CreateTrajetRequest;
import com.healdrive.dto.StatutUpdateRequest;
import com.healdrive.dto.TrajetResponse;
import com.healdrive.service.TrajetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/trajets")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TrajetController {

    private final TrajetService trajetService;

    /**
     * GET /api/trajets/{id}
     * Detail d'un trajet.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TrajetResponse> getTrajet(@PathVariable UUID id) {
        return ResponseEntity.ok(trajetService.getTrajet(id));
    }

    /**
     * POST /api/trajets
     * Creer un trajet EN_ATTENTE.
     * Body : { "depart", "destination", "date", "heure", "type_vehicule", "patientId" }
     */
    @PostMapping
    public ResponseEntity<TrajetResponse> createTrajet(@RequestBody CreateTrajetRequest request) {
        return ResponseEntity.status(201).body(trajetService.createTrajet(request));
    }

    /**
     * GET /api/trajets/patient/{patientId}
     * Tous les trajets d'un patient.
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<TrajetResponse>> getTrajetsPatient(@PathVariable UUID patientId) {
        return ResponseEntity.ok(trajetService.getTrajetsPatient(patientId));
    }

    /**
     * GET /api/trajets/chauffeur/{chauffeurId}
     * Tous les trajets d'un chauffeur.
     */
    @GetMapping("/chauffeur/{chauffeurId}")
    public ResponseEntity<List<TrajetResponse>> getTrajetsChauffeur(@PathVariable UUID chauffeurId) {
        return ResponseEntity.ok(trajetService.getTrajetsChauffeur(chauffeurId));
    }

    /**
     * GET /api/trajets/chauffeur/{chauffeurId}/actifs
     * Courses actives (ACCEPTE + EN_COURS) d'un chauffeur.
     */
    @GetMapping("/chauffeur/{chauffeurId}/actifs")
    public ResponseEntity<List<TrajetResponse>> getTrajetsActifs(@PathVariable UUID chauffeurId) {
        return ResponseEntity.ok(trajetService.getTrajetsActifsChauffeur(chauffeurId));
    }

    /**
     * GET /api/trajets/disponibles
     * Toutes les courses EN_ATTENTE.
     */
    @GetMapping("/disponibles")
    public ResponseEntity<List<TrajetResponse>> getTrajetsDisponibles(
            @RequestParam(required = false) String typeVehicule) {
        if (typeVehicule != null && !typeVehicule.isBlank()) {
            return ResponseEntity.ok(trajetService.getTrajetsDisponibles(typeVehicule));
        }
        return ResponseEntity.ok(trajetService.getAllTrajetsDisponibles());
    }

    /**
     * PUT /api/trajets/{id}/statut
     * Changer le statut d'un trajet.
     * Body : { "nouveauStatut": "ACCEPTE", "chauffeurId": "...", "commentaire": "..." }
     */
    @PutMapping("/{id}/statut")
    public ResponseEntity<TrajetResponse> updateStatut(
            @PathVariable UUID id,
            @RequestBody StatutUpdateRequest request) {
        return ResponseEntity.ok(trajetService.updateStatut(id, request));
    }

    /**
     * DELETE /api/trajets/{id}?userId=...
     * Annuler un trajet (patient, si EN_ATTENTE).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> annulerTrajet(
            @PathVariable UUID id,
            @RequestParam UUID userId) {
        trajetService.annulerTrajet(id, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/trajets/stats/patient/{patientId}
     * Stats dashboard patient.
     */
    @GetMapping("/stats/patient/{patientId}")
    public ResponseEntity<DashboardStats> getStatsPatient(@PathVariable UUID patientId) {
        return ResponseEntity.ok(trajetService.getStatsPatient(patientId));
    }

    /**
     * GET /api/trajets/stats/chauffeur/{chauffeurId}
     * Stats dashboard chauffeur.
     */
    @GetMapping("/stats/chauffeur/{chauffeurId}")
    public ResponseEntity<DashboardStats> getStatsChauffeur(@PathVariable UUID chauffeurId) {
        return ResponseEntity.ok(trajetService.getStatsChauffeur(chauffeurId));
    }
}
