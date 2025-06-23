package com.ipdsystem.sistemaipd.Dto;

import lombok.Data;

@Data
public class HorarioAsignacionRequestDTO {
    private Long deportistaId;
    private String dia;
    private String horario; // Ej. "09:00 - 11:00"
    private String actividad;
}