package com.ipdsystem.sistemaipd.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgresoDataDTO {
    private String deportistaNombre;
    private LocalDate fecha;
    private Double valor;
}
