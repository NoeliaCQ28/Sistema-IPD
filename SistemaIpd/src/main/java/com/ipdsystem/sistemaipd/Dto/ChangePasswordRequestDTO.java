package com.ipdsystem.sistemaipd.Dto;

import lombok.Data;

/**
 * DTO para la petición de cambio de contraseña.
 * Transporta la contraseña antigua y la nueva (con su confirmación) desde el frontend.
 */
@Data
public class ChangePasswordRequestDTO {
    private String oldPassword;
    private String newPassword;
    private String confirmPassword;
}