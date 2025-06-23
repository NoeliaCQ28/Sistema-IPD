package com.ipdsystem.sistemaipd.Dto;

import lombok.Data;

@Data
public class MensajeRequestDTO {
    private Long remitenteId;
    private String remitenteRol; // "DEPORTISTA" o "ENTRENADOR"
    private Long receptorId;
    private String receptorRol; // "DEPORTISTA" o "ENTRENADOR"
    private String contenido;
}