package com.ipdsystem.sistemaipd.Dto;

import lombok.Data;

@Data
public class EntrenadorProfileUpdateDTO {
    private String correo;
    private String telefono;
    // Nota: No incluimos campos sensibles que el usuario no debería poder cambiar,
    // como nombres, DNI, o disciplina.
}
    