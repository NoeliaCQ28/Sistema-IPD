package com.ipdsystem.sistemaipd.Dto;

import com.ipdsystem.sistemaipd.Entity.Administrador;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class AdministradorDetailDTO {
    private Long id;
    private String nombres;
    private String apellidos;
    private String dni;
    private LocalDate fechaNacimiento;
    private String correo;
    private String telefono;
    private String rol;
    private LocalDateTime fechaRegistro;
    private boolean activo;

    public static AdministradorDetailDTO fromEntity(Administrador admin) {
        AdministradorDetailDTO dto = new AdministradorDetailDTO();
        dto.setId(admin.getId());
        dto.setNombres(admin.getNombres());
        dto.setApellidos(admin.getApellidos());
        dto.setDni(admin.getDni());
        dto.setFechaNacimiento(admin.getFechaNacimiento());
        dto.setCorreo(admin.getCorreo());
        dto.setTelefono(admin.getTelefono());
        dto.setRol(admin.getRol());
        dto.setFechaRegistro(admin.getFechaRegistro());
        dto.setActivo(admin.isActivo());
        return dto;
    }
}