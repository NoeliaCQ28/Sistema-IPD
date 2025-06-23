package com.ipdsystem.sistemaipd.Dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DeportistaRequestDTO {

    private String nombres;
    private String apellidos;
    private String dni;
    private LocalDate fechaNacimiento;
    private String correo;
    private String telefono;
    private String disciplina;
    private Double peso;
    private Long entrenadorId;
    private boolean activo; // <<<--- ¡AÑADIR ESTA PROPIEDAD!

}