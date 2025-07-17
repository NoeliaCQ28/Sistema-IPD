package com.ipdsystem.sistemaipd.Dto;

import lombok.Data;

@Data
public class PasswordResetRequestDTO {
    private String token;
    private String newPassword;
}