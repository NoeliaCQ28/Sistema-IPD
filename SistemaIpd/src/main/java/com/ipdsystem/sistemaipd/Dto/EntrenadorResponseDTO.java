package com.ipdsystem.sistemaipd.Dto;

import lombok.Data;

@Data
public class EntrenadorResponseDTO {
    private Long id;
    private String nombres;
    private String apellidos;
    // --- CAMPOS NUEVOS ---
    private String dni;
    private String correo;
    private String disciplinaQueEntrena;
}