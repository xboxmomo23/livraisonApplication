package com.healdrive.model.enums;

/**
 * Cycle de vie d'un trajet.
 * Mappé sur le type PostgreSQL : statut_trajet
 */
public enum StatutTrajet {
    EN_ATTENTE,
    ACCEPTE,
    EN_COURS,
    TERMINE,
    ANNULE
}
