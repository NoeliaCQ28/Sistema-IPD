package com.ipdsystem.sistemaipd.Dto;

import com.ipdsystem.sistemaipd.Entity.Asistencia;
import lombok.Data;
import java.time.LocalDate;

@Data
public class AsistenciaResponseDTO {
    private Long id;
    private LocalDate fecha;
    private Asistencia.EstadoAsistencia estado;
    private Long deportistaId;
    private String deportistaNombreCompleto;
    private Long entrenadorId;
    private String entrenadorNombreCompleto;

    /**
     * Convierte una entidad Asistencia a su DTO de respuesta.
     * @param asistencia La entidad a convertir.
     * @return El DTO poblado con los datos de la entidad.
     */
    public static AsistenciaResponseDTO fromEntity(Asistencia asistencia) {
        AsistenciaResponseDTO dto = new AsistenciaResponseDTO();
        dto.setId(asistencia.getId());
        dto.setFecha(asistencia.getFecha());
        dto.setEstado(asistencia.getEstado());

        if (asistencia.getDeportista() != null) {
            dto.setDeportistaId(asistencia.getDeportista().getId());
            dto.setDeportistaNombreCompleto(asistencia.getDeportista().getNombres() + " " + asistencia.getDeportista().getApellidos());
        }

        if (asistencia.getEntrenador() != null) {
            dto.setEntrenadorId(asistencia.getEntrenador().getId());
            dto.setEntrenadorNombreCompleto(asistencia.getEntrenador().getNombres() + " " + asistencia.getEntrenador().getApellidos());
        }

        return dto;
    }
}
    