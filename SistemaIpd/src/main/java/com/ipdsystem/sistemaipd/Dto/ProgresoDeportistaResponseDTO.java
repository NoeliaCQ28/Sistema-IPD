package com.ipdsystem.sistemaipd.Dto;

import com.ipdsystem.sistemaipd.Entity.ProgresoDeportista;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Data
public class ProgresoDeportistaResponseDTO {
    private Long id;
    private Long deportistaId;
    private String deportistaNombreCompleto;
    private Long entrenadorId;
    private String entrenadorNombreCompleto;
    private LocalDate fechaRegistro;
    private String tipoMebrica;
    private Double valor;
    private String observaciones;
    private LocalDateTime fechaCreacion;

    public static ProgresoDeportistaResponseDTO fromEntity(ProgresoDeportista progreso) {
        ProgresoDeportistaResponseDTO dto = new ProgresoDeportistaResponseDTO();
        dto.setId(progreso.getId());

        // --- LÓGICA CORREGIDA CON VALIDACIÓN DE NULOS MÁS ROBUSTA ---
        if (progreso.getDeportista() != null) {
            dto.setDeportistaId(progreso.getDeportista().getId());
            // Construimos el nombre de forma segura
            List<String> nombreParts = new ArrayList<>();
            if (progreso.getDeportista().getNombres() != null) {
                nombreParts.add(progreso.getDeportista().getNombres());
            }
            if (progreso.getDeportista().getApellidos() != null) {
                nombreParts.add(progreso.getDeportista().getApellidos());
            }
            dto.setDeportistaNombreCompleto(String.join(" ", nombreParts));
        } else {
            dto.setDeportistaNombreCompleto("Deportista no asignado");
        }

        if (progreso.getEntrenador() != null) {
            dto.setEntrenadorId(progreso.getEntrenador().getId());
            // Construimos el nombre del entrenador de forma segura
            List<String> entrenadorNombreParts = new ArrayList<>();
            if (progreso.getEntrenador().getNombres() != null) {
                entrenadorNombreParts.add(progreso.getEntrenador().getNombres());
            }
            if (progreso.getEntrenador().getApellidos() != null) {
                entrenadorNombreParts.add(progreso.getEntrenador().getApellidos());
            }
            dto.setEntrenadorNombreCompleto(String.join(" ", entrenadorNombreParts));
        } else {
            dto.setEntrenadorNombreCompleto("Entrenador no asignado");
        }
        // --- FIN DE LA CORRECCIÓN ---

        dto.setFechaRegistro(progreso.getFechaRegistro());
        dto.setTipoMebrica(progreso.getTipoMebrica());
        dto.setValor(progreso.getValor());
        dto.setObservaciones(progreso.getObservaciones());
        dto.setFechaCreacion(progreso.getFechaCreacion());
        return dto;
    }
}
