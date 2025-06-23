package com.ipdsystem.sistemaipd.Dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MensajeResponseDTO {
    private Long id;
    private String contenido;
    private LocalDateTime fechaEnvio;
    private boolean leido;

    private Long remitenteId;
    private String remitenteRol;
    private String remitenteNombre; // Se llenará en el servicio

    private Long receptorId;
    private String receptorRol;
    private String receptorNombre; // Se llenará en el servicio
}