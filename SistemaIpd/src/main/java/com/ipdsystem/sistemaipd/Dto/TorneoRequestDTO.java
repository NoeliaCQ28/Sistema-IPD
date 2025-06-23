package com.ipdsystem.sistemaipd.Dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TorneoRequestDTO {
    private String nombre;
    private String lugar;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String categoria;
    private String descripcion;
}