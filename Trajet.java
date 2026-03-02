package com.healdrive.model;

import com.healdrive.model.enums.StatutTrajet;
import com.healdrive.model.enums.TypeVehicule;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Cœur métier — représente une course de transport médical.
 * Relie Patient, Chauffeur, Prescription et Véhicule.
 */
@Entity
@Table(name = "trajets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trajet {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false)
    private UUID id;

    // --- Relations ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Prescription prescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private ProfilPatient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chauffeur_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private ProfilChauffeur chauffeur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicule_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Vehicule vehicule;

    // --- Géographie ---

    @Column(name = "depart_adresse", nullable = false, length = 500)
    private String departAdresse;

    @Column(name = "depart_lat", columnDefinition = "DOUBLE PRECISION")
    private Double departLat;

    @Column(name = "depart_lng", columnDefinition = "DOUBLE PRECISION")
    private Double departLng;

    @Column(name = "destination_adresse", nullable = false, length = 500)
    private String destinationAdresse;

    @Column(name = "destination_lat", columnDefinition = "DOUBLE PRECISION")
    private Double destinationLat;

    @Column(name = "destination_lng", columnDefinition = "DOUBLE PRECISION")
    private Double destinationLng;

    // --- Planning ---

    @Column(name = "date_trajet", nullable = false)
    private LocalDate dateTrajet;

    @Column(name = "heure_trajet", nullable = false)
    private LocalTime heureTrajet;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_vehicule", nullable = false, columnDefinition = "type_vehicule")
    private TypeVehicule typeVehicule;

    // --- Statut & Suivi ---

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "statut_trajet")
    @Builder.Default
    private StatutTrajet statut = StatutTrajet.EN_ATTENTE;

    @Column(name = "date_acceptation")
    private OffsetDateTime dateAcceptation;

    @Column(name = "date_debut")
    private OffsetDateTime dateDebut;

    @Column(name = "date_fin")
    private OffsetDateTime dateFin;

    // --- Financier ---

    @Column(name = "distance_km", precision = 8, scale = 2)
    private BigDecimal distanceKm;

    @Column(name = "duree_estimee_min")
    private Integer dureeEstimeeMin;

    @Column(name = "prix_estime", precision = 8, scale = 2)
    private BigDecimal prixEstime;

    @Column(name = "prix_final", precision = 8, scale = 2)
    private BigDecimal prixFinal;

    // --- Métadonnées ---

    @Column(name = "notes_patient", columnDefinition = "TEXT")
    private String notesPatient;

    @Column(name = "notes_chauffeur", columnDefinition = "TEXT")
    private String notesChauffeur;

    @Column(name = "motif_annulation", length = 500)
    private String motifAnnulation;

    @CreationTimestamp
    @Column(name = "date_creation", nullable = false, updatable = false)
    private OffsetDateTime dateCreation;

    @UpdateTimestamp
    @Column(name = "date_maj", nullable = false)
    private OffsetDateTime dateMaj;

    // --- Relations inverses ---

    @OneToMany(mappedBy = "trajet", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @OrderBy("dateEnvoi ASC")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @Builder.Default
    private List<Message> messages = new ArrayList<>();

    @OneToMany(mappedBy = "trajet", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @OrderBy("dateCreation ASC")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @Builder.Default
    private List<HistoriqueStatut> historiqueStatuts = new ArrayList<>();
}
