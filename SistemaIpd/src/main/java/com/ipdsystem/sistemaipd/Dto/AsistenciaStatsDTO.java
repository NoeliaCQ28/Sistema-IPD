package com.ipdsystem.sistemaipd.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AsistenciaStatsDTO {
    private Long deportistaId;
    private String deportistaNombre;
    private long totalPresente;
    private long totalAusente;
    private long totalJustificado;
    private long totalRegistros;
    private double porcentajeAsistencia;
}
