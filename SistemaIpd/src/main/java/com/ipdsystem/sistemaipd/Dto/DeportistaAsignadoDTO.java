package com.ipdsystem.sistemaipd.Dto;

import com.ipdsystem.sistemaipd.Entity.Deportista;
import lombok.Data;

@Data
public class DeportistaAsignadoDTO {
    private Long id;
    private String nombreCompleto;
    private String disciplina;

    public static DeportistaAsignadoDTO fromEntity(Deportista deportista) {
        DeportistaAsignadoDTO dto = new DeportistaAsignadoDTO();
        dto.setId(deportista.getId());
        dto.setNombreCompleto(deportista.getNombres() + " " + deportista.getApellidos());
        dto.setDisciplina(deportista.getDisciplina());
        return dto;
    }
}