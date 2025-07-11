package com.ipdsystem.sistemaipd.Dto;

import com.ipdsystem.sistemaipd.Entity.Entrenador;
import com.ipdsystem.sistemaipd.Entity.Deportista;
import com.ipdsystem.sistemaipd.Entity.HorarioEntrenamiento;
import com.ipdsystem.sistemaipd.Entity.ProgresoDeportista;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
public class EntrenadorDetailDTO {
    private Long id;
    private String nombres;
    private String apellidos;
    private String dni;
    private LocalDate fechaNacimiento;
    private String correo;
    private String telefono;
    private String disciplinaQueEntrena;
    private String profesion;
    private String especialidad;
    private LocalDateTime fechaContratacion;
    private boolean activo;

    private List<DeportistaAsignadoInfo> deportistasACargo;
    private List<HorarioEntrenamientoInfo> horariosCreados;
    private List<ProgresoDeportistaDTO> progresosRegistrados;

    @Data
    public static class DeportistaAsignadoInfo {
        private Long id;
        private String nombreCompleto;
        private String disciplina;
    }

    // --- SUBCLASE CORREGIDA ---
    @Data
    public static class HorarioEntrenamientoInfo {
        private Long id;
        private String dia;
        private String horario;
        private String actividad;
        private String deportistaNombre; // Campo corregido
    }

    @Data
    public static class ProgresoDeportistaDTO {
        private Long id;
        private Long deportistaId;
        private String deportistaNombre;
        private Long entrenadorId;
        private String entrenadorNombre;
        private LocalDate fechaRegistro;
        private String tipoMebrica;
        private Double valor;
        private String observaciones;
        private LocalDateTime fechaCreacion;
    }


    public static EntrenadorDetailDTO fromEntity(Entrenador entrenador) {
        EntrenadorDetailDTO dto = new EntrenadorDetailDTO();
        dto.setId(entrenador.getId());
        dto.setNombres(entrenador.getNombres());
        dto.setApellidos(entrenador.getApellidos());
        dto.setDni(entrenador.getDni());
        dto.setFechaNacimiento(entrenador.getFechaNacimiento());
        dto.setCorreo(entrenador.getCorreo());
        dto.setTelefono(entrenador.getTelefono());
        dto.setDisciplinaQueEntrena(entrenador.getDisciplinaQueEntrena());
        dto.setProfesion(entrenador.getProfesion());
        dto.setEspecialidad(entrenador.getEspecialidad() != null ? entrenador.getEspecialidad() : entrenador.getDisciplinaQueEntrena());
        dto.setFechaContratacion(entrenador.getFechaContratacion());
        dto.setActivo(entrenador.isActivo());

        Set<Deportista> deportistasEntity = entrenador.getDeportistasACargo();
        if (deportistasEntity != null && !deportistasEntity.isEmpty()) {
            dto.setDeportistasACargo(
                    deportistasEntity.stream()
                            .map(dep -> {
                                DeportistaAsignadoInfo depInfo = new DeportistaAsignadoInfo();
                                depInfo.setId(dep.getId());
                                depInfo.setNombreCompleto(dep.getNombres() + " " + dep.getApellidos());
                                depInfo.setDisciplina(dep.getDisciplina());
                                return depInfo;
                            })
                            .collect(Collectors.toCollection(ArrayList::new))
            );
        } else {
            dto.setDeportistasACargo(new ArrayList<>());
        }

        // --- LÓGICA DE MAPEO CORREGIDA ---
        Set<HorarioEntrenamiento> horariosEntity = entrenador.getHorariosCreados();
        if (horariosEntity != null && !horariosEntity.isEmpty()) {
            dto.setHorariosCreados(
                    horariosEntity.stream()
                            .map(horario -> {
                                HorarioEntrenamientoInfo horarioInfo = new HorarioEntrenamientoInfo();
                                horarioInfo.setId(horario.getId());
                                horarioInfo.setDia(horario.getDia());
                                horarioInfo.setHorario(horario.getHorario());
                                horarioInfo.setActividad(horario.getActividad());
                                // Ahora obtenemos el nombre del DEPORTISTA, no del entrenador
                                if (horario.getDeportista() != null) {
                                    horarioInfo.setDeportistaNombre(horario.getDeportista().getNombres() + " " + horario.getDeportista().getApellidos());
                                } else {
                                    horarioInfo.setDeportistaNombre("No asignado");
                                }
                                return horarioInfo;
                            })
                            .collect(Collectors.toCollection(ArrayList::new))
            );
        } else {
            dto.setHorariosCreados(new ArrayList<>());
        }
        // --- FIN DE LA CORRECCIÓN ---

        Set<ProgresoDeportista> progresosRegistradosEntity = entrenador.getProgresosRegistrados();
        if (progresosRegistradosEntity != null && !progresosRegistradosEntity.isEmpty()) {
            dto.setProgresosRegistrados(
                    progresosRegistradosEntity.stream()
                            .map(progreso -> {
                                ProgresoDeportistaDTO progresoDto = new ProgresoDeportistaDTO();
                                progresoDto.setId(progreso.getId());
                                if (progreso.getDeportista() != null) {
                                    progresoDto.setDeportistaId(progreso.getDeportista().getId());
                                    progresoDto.setDeportistaNombre(progreso.getDeportista().getNombres() + " " + progreso.getDeportista().getApellidos());
                                }
                                if (progreso.getEntrenador() != null) {
                                    progresoDto.setEntrenadorId(progreso.getEntrenador().getId());
                                    progresoDto.setEntrenadorNombre(progreso.getEntrenador().getNombres() + " " + progreso.getEntrenador().getApellidos());
                                }
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
            dto.setProgresosRegistrados(new ArrayList<>());
        }

        return dto;
    }
}
