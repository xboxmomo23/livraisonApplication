package com.healdrive.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrajetResponse {

    private UUID id;

    private String departAdresse;
    private Double departLat;
    private Double departLng;
    private String destinationAdresse;
    private Double destinationLat;
    private Double destinationLng;

    private LocalDate dateTrajet;
    private LocalTime heureTrajet;
    private String typeVehicule;
    private String statut;

    private BigDecimal distanceKm;
    private Integer dureeEstimeeMin;
    private BigDecimal prixEstime;
    private BigDecimal prixFinal;

    private String notesPatient;
    private String notesChauffeur;

    private OffsetDateTime dateAcceptation;
    private OffsetDateTime dateDebut;
    private OffsetDateTime dateFin;
    private OffsetDateTime dateCreation;

    private UUID patientId;
    private String patientNom;
    private String patientPrenom;
    private String patientTelephone;
    private String patientAdresse;

    private UUID chauffeurId;
    private String chauffeurNom;
    private String chauffeurPrenom;
    private String chauffeurTelephone;

    private UUID vehiculeId;
    private String vehiculeMarque;
    private String vehiculeModele;
    private String vehiculeImmatriculation;

    private UUID prescriptionId;
    private String medecinPrescripteur;
    private String etablissement;
    private String motifPrescription;
    private LocalDate prescriptionDateValidite;
    private String prescriptionFichierUrl;
}
