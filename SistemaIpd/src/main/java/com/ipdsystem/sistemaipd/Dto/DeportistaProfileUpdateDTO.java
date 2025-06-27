package com.ipdsystem.sistemaipd.Dto;

import lombok.Data;

@Data
public class DeportistaProfileUpdateDTO {
    // Solo incluimos los campos que el deportista puede editar.
    private String correo;
    private String telefono;
    private Double peso;
}