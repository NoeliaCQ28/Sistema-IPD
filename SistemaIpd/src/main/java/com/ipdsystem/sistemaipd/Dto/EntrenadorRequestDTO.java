package com.ipdsystem.sistemaipd.Dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class EntrenadorRequestDTO {
    private String nombres;
    private String apellidos;
    private String dni;
    private LocalDate fechaNacimiento;
    private String correo;
    private String telefono;
    private String disciplinaQueEntrena;
    private String profesion;
}