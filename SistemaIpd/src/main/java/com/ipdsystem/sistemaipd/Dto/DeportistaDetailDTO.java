package com.ipdsystem.sistemaipd.Dto;

import com.ipdsystem.sistemaipd.Entity.Deportista;
import com.ipdsystem.sistemaipd.Entity.Entrenador;
import com.ipdsystem.sistemaipd.Entity.HorarioEntrenamiento;
import com.ipdsystem.sistemaipd.Entity.ProgresoDeportista;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
public class DeportistaDetailDTO {
    private Long id;
    private String nombres;
    private String apellidos;
    private String dni;
    private LocalDate fechaNacimiento;
    private String correo;
    private String telefono;
    private String disciplina;
    private Double peso;
    private LocalDateTime fechaRegistro;
    private boolean activo;

    private EntrenadorInfo entrenador;
    private List<HorarioEntrenamientoDTO> horarioEntrenamiento;
    private List<ProgresoDeportistaDTO> progresos;

    @Data
    public static class EntrenadorInfo {
        private Long id;
        private String nombreCompleto;
        private String especialidad;
    }

    @Data
    public static class HorarioEntrenamientoDTO {
        private Long id;
        private String dia;
        private String horario;
        private String actividad;
        private String entrenadorNombre;
    }

    @Data
    public static class ProgresoDeportistaDTO {
        private Long id;
        private Long entrenadorId;
        private String entrenadorNombre;
        private LocalDate fechaRegistro;
        private String tipoMebrica;
        private Double valor;
        private String observaciones;
        private LocalDateTime fechaCreacion;
    }

    public static DeportistaDetailDTO fromEntity(Deportista deportista) {
        DeportistaDetailDTO dto = new DeportistaDetailDTO();
        dto.setId(deportista.getId());
        dto.setNombres(deportista.getNombres());
        dto.setApellidos(deportista.getApellidos());
        dto.setDni(deportista.getDni());
        dto.setFechaNacimiento(deportista.getFechaNacimiento());
        dto.setCorreo(deportista.getCorreo());
        dto.setTelefono(deportista.getTelefono());
        dto.setDisciplina(deportista.getDisciplina());
        dto.setPeso(deportista.getPeso());
        dto.setFechaRegistro(deportista.getFechaRegistro());
        dto.setActivo(deportista.isActivo());

        if (deportista.getEntrenador() != null) {
            EntrenadorInfo entrenadorInfo = new EntrenadorInfo();
            entrenadorInfo.setId(deportista.getEntrenador().getId());
            entrenadorInfo.setNombreCompleto(deportista.getEntrenador().getNombres() + " " + deportista.getEntrenador().getApellidos());
            entrenadorInfo.setEspecialidad(deportista.getEntrenador().getEspecialidad() != null ? deportista.getEntrenador().getEspecialidad() : deportista.getEntrenador().getDisciplinaQueEntrena());
            dto.setEntrenador(entrenadorInfo);
        }

        Set<HorarioEntrenamiento> horariosEntity = deportista.getHorariosEntrenamiento();
        if (horariosEntity != null && !horariosEntity.isEmpty()) {
            List<HorarioEntrenamiento> safeHorariosList = new ArrayList<>(horariosEntity);
            dto.setHorarioEntrenamiento(
                    safeHorariosList.stream()
                            .map(horario -> {
                                HorarioEntrenamientoDTO horarioDto = new HorarioEntrenamientoDTO();
                                horarioDto.setId(horario.getId());
                                horarioDto.setDia(horario.getDia());
                                horarioDto.setHorario(horario.getHorario());
                                horarioDto.setActividad(horario.getActividad());
                                if (horario.getEntrenador() != null) {
                                    horarioDto.setEntrenadorNombre(horario.getEntrenador().getNombres() + " " + horario.getEntrenador().getApellidos());
                                }
                                return horarioDto;
                            })
                            .collect(Collectors.toCollection(ArrayList::new))
            );
        } else {
            dto.setHorarioEntrenamiento(new ArrayList<>());
        }

        Set<ProgresoDeportista> progresosEntity = deportista.getProgresos();
        if (progresosEntity != null && !progresosEntity.isEmpty()) {
            List<ProgresoDeportista> safeProgresosList = new ArrayList<>(progresosEntity);
            dto.setProgresos(
                    safeProgresosList.stream()
                            .map(progreso -> {
                                ProgresoDeportistaDTO progresoDto = new ProgresoDeportistaDTO();
                                progresoDto.setId(progreso.getId());
                                progresoDto.setEntrenadorId(progreso.getEntrenador().getId());
                                progresoDto.setEntrenadorNombre(progreso.getEntrenador().getNombres() + " " + progreso.getEntrenador().getApellidos());
                                progresoDto.setFechaRegistro(progreso.getFechaRegistro());
                                progresoDto.setTipoMebrica(progreso.getTipoMebrica());
                                progresoDto.setValor(progreso.getValor());
                                progresoDto.setObservaciones(progreso.getObservaciones());
                                progresoDto.setFechaCreacion(progreso.getFechaCreacion());
                                return progresoDto;
                            })
                            .collect(Collectors.toCollection(ArrayList::new))
            );
        } else {
            dto.setProgresos(new ArrayList<>());
        }

        return dto;
    }
}