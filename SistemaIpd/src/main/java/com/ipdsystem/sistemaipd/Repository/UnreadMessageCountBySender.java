package com.ipdsystem.sistemaipd.Repository;

/**
 * Interfaz para mapear el resultado de la consulta de conteo.
 * Spring Data JPA la implementará automáticamente en tiempo de ejecución.
 */
public interface UnreadMessageCountBySender {
    Long getRemitenteId();
    Long getCount();
}