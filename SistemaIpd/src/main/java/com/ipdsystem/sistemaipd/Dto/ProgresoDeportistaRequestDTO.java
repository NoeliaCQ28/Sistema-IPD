package com.ipdsystem.sistemaipd.Dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ProgresoDeportistaRequestDTO {
    private Long deportistaId;
    private Long entrenadorId; // El ID del entrenador que lo registra (se puede obtener del SecurityContext también)
    private LocalDate fechaRegistro;
    private String tipoMebrica;
    private Double valor;
    private String observaciones;
}