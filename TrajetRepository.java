package com.healdrive.repository;

import com.healdrive.model.Trajet;
import com.healdrive.model.enums.StatutTrajet;
import com.healdrive.model.enums.TypeVehicule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface TrajetRepository extends JpaRepository<Trajet, UUID> {

    List<Trajet> findByPatientIdOrderByDateTrajetDesc(UUID patientId);

    List<Trajet> findByChauffeurIdOrderByDateTrajetDesc(UUID chauffeurId);

    List<Trajet> findByStatut(StatutTrajet statut);

    List<Trajet> findByPatientIdAndStatut(UUID patientId, StatutTrajet statut);

    List<Trajet> findByChauffeurIdAndStatut(UUID chauffeurId, StatutTrajet statut);

    /**
     * Smart Matching côté trajet : courses EN_ATTENTE d'un type de véhicule donné,
     * triées par date la plus proche.
     */
    @Query("""
        SELECT t FROM Trajet t
        WHERE t.statut = 'EN_ATTENTE'
          AND t.typeVehicule = :typeVehicule
          AND t.dateTrajet >= :fromDate
        ORDER BY t.dateTrajet ASC, t.heureTrajet ASC
        """)
    List<Trajet> findAvailableForMatching(
            @Param("typeVehicule") TypeVehicule typeVehicule,
            @Param("fromDate") LocalDate fromDate
    );

    /**
     * Courses actives (non terminées, non annulées) d'un chauffeur.
     */
    @Query("""
        SELECT t FROM Trajet t
        WHERE t.chauffeur.id = :chauffeurId
          AND t.statut IN ('ACCEPTE', 'EN_COURS')
        ORDER BY t.dateTrajet ASC
        """)
    List<Trajet> findActiveByChauffeurId(@Param("chauffeurId") UUID chauffeurId);

    /**
     * Comptage par statut pour le dashboard.
     */
    long countByPatientIdAndStatut(UUID patientId, StatutTrajet statut);

    long countByChauffeurIdAndStatut(UUID chauffeurId, StatutTrajet statut);
}
