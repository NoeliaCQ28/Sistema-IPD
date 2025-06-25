package com.ipdsystem.sistemaipd.Dto;

import com.ipdsystem.sistemaipd.Entity.Asistencia;
import lombok.Data;
import java.time.LocalDate;

@Data
public class AsistenciaRequestDTO {
    private Long deportistaId;
    private LocalDate fecha;
    private Asistencia.EstadoAsistencia estado;
}
    