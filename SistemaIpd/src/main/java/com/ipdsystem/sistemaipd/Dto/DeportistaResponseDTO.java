package com.ipdsystem.sistemaipd.Dto;

import com.ipdsystem.sistemaipd.Entity.Deportista;
import lombok.Data;

@Data
public class DeportistaResponseDTO {
    private Long id;
    private String nombres;
    private String apellidos;
    private String dni;
    private String correo;
    private String disciplina;
    // No incluir relaciones complejas aquí para evitar LazyInitializationException en listas

    public static DeportistaResponseDTO fromEntity(Deportista deportista) {
        DeportistaResponseDTO dto = new DeportistaResponseDTO();
        dto.setId(deportista.getId());
        dto.setNombres(deportista.getNombres());
        dto.setApellidos(deportista.getApellidos());
        dto.setDni(deportista.getDni());
        dto.setCorreo(deportista.getCorreo());
        dto.setDisciplina(deportista.getDisciplina());
        return dto;
    }
}