package com.ipdsystem.sistemaipd.Dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventoRequestDTO {
    private String title;
    private LocalDateTime start;
    private LocalDateTime end;
    private String disciplina; // <-- CAMPO NUEVO
}