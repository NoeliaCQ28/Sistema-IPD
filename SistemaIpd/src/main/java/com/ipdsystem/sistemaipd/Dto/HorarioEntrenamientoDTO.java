package com.ipdsystem.sistemaipd.Dto;

import com.ipdsystem.sistemaipd.Entity.HorarioEntrenamiento;
import lombok.Data;

@Data
public class HorarioEntrenamientoDTO {
    private Long id;
    private String dia;
    private String horario;
    private String actividad;
    private Long deportistaId;
    private String deportistaNombre;

    public static HorarioEntrenamientoDTO fromEntity(HorarioEntrenamiento horario) {
        HorarioEntrenamientoDTO dto = new HorarioEntrenamientoDTO();
        dto.setId(horario.getId());
        dto.setDia(horario.getDia());
        dto.setHorario(horario.getHorario());
        dto.setActividad(horario.getActividad());
        if (horario.getDeportista() != null) {
            dto.setDeportistaId(horario.getDeportista().getId());
            dto.setDeportistaNombre(horario.getDeportista().getNombres() + " " + horario.getDeportista().getApellidos());
        }
        return dto;
    }
}
