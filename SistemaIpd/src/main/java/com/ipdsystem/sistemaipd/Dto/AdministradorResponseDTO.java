package com.ipdsystem.sistemaipd.Dto;

import com.ipdsystem.sistemaipd.Entity.Administrador; // Importa la entidad Administrador
import lombok.Data; // Importa la anotación @Data de Lombok

@Data // Anotación de Lombok para generar getters, setters, toString, equals y hashCode
public class AdministradorResponseDTO {
    private Long id;
    private String nombres;
    private String apellidos;
    private String dni;
    private String correo;

    // Método estático para convertir una entidad Administrador a este DTO
    public static AdministradorResponseDTO fromEntity(Administrador administrador) {
        AdministradorResponseDTO dto = new AdministradorResponseDTO();
        dto.setId(administrador.getId());
        dto.setNombres(administrador.getNombres());
        dto.setApellidos(administrador.getApellidos());
        dto.setDni(administrador.getDni());
        dto.setCorreo(administrador.getCorreo());
        return dto;
    }
}