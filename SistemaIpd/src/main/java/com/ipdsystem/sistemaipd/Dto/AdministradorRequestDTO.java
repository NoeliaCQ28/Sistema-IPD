package com.ipdsystem.sistemaipd.Dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AdministradorRequestDTO {
    private String nombres;
    private String apellidos;
    private String dni;
    private LocalDate fechaNacimiento;
    private String correo;
    private String telefono;
    // La contraseña es opcional al actualizar, y se establece al crear.
    private String password;
}