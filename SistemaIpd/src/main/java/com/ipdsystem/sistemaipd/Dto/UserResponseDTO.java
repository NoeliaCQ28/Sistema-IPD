package com.ipdsystem.sistemaipd.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String nombres;
    private String apellidos;
    private String correo;
    private String rol;
    private String disciplina; // <-- CAMPO NUEVO
    private List<String> authorities;
}