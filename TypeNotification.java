package com.healdrive.model.enums;

/**
 * Catégories de notifications in-app.
 * Mappé sur le type PostgreSQL : type_notification
 */
public enum TypeNotification {
    COURSE_ACCEPTEE,
    COURSE_DEMARREE,
    COURSE_TERMINEE,
    NOUVEAU_MESSAGE,
    RAPPEL,
    SYSTEME
}
