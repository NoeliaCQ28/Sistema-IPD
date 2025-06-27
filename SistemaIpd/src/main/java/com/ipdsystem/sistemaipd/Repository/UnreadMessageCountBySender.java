package com.ipdsystem.sistemaipd.Repository;

/**
 * Interfaz para mapear el resultado de la consulta de conteo de mensajes no leídos.
 * Spring Data JPA la implementará automáticamente.
 */
public interface UnreadMessageCountBySender {
    Long getRemitenteId();
    Long getCount();
}
