package com.ipdsystem.sistemaipd.Dto;

import com.ipdsystem.sistemaipd.Entity.ProgresoDeportista;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ProgresoDeportistaResponseDTO {
    private Long id;
    private Long deportistaId;
    private String deportistaNombreCompleto; // Para mostrar en el frontend
    private Long entrenadorId;
    private String entrenadorNombreCompleto; // Para mostrar en el frontend
    private LocalDate fechaRegistro;
    private String tipoMebrica;
    private Double valor;
    private String observaciones;
    private LocalDateTime fechaCreacion;

    public static ProgresoDeportistaResponseDTO fromEntity(ProgresoDeportista progreso) {
        ProgresoDeportistaResponseDTO dto = new ProgresoDeportistaResponseDTO();
        dto.setId(progreso.getId());
        dto.setDeportistaId(progreso.getDeportista().getId());
        dto.setDeportistaNombreCompleto(progreso.getDeportista().getNombres() + " " + progreso.getDeportista().getApellidos());
        dto.setEntrenadorId(progreso.getEntrenador().getId());
        dto.setEntrenadorNombreCompleto(progreso.getEntrenador().getNombres() + " " + progreso.getEntrenador().getApellidos());
        dto.setFechaRegistro(progreso.getFechaRegistro());
        dto.setTipoMebrica(progreso.getTipoMebrica());
        dto.setValor(progreso.getValor());
        dto.setObservaciones(progreso.getObservaciones());
        dto.setFechaCreacion(progreso.getFechaCreacion());
        return dto;
    }
}