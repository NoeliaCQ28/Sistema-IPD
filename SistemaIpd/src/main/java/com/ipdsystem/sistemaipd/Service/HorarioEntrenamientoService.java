package com.ipdsystem.sistemaipd.Service;

import com.ipdsystem.sistemaipd.Dto.HorarioAsignacionRequestDTO;
import com.ipdsystem.sistemaipd.Dto.HorarioEntrenamientoDTO;
import com.ipdsystem.sistemaipd.Entity.Deportista;
import com.ipdsystem.sistemaipd.Entity.HorarioEntrenamiento;
import com.ipdsystem.sistemaipd.Repository.DeportistaRepository;
import com.ipdsystem.sistemaipd.Repository.HorarioEntrenamientoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HorarioEntrenamientoService {

    @Autowired
    private HorarioEntrenamientoRepository horarioRepository;

    @Autowired
    private DeportistaRepository deportistaRepository;

    @Transactional(readOnly = true)
    public List<HorarioEntrenamientoDTO> getHorariosByEntrenadorId(Long entrenadorId) {
        List<HorarioEntrenamiento> horarios = horarioRepository.findByEntrenadorId(entrenadorId);
        return horarios.stream()
                .map(HorarioEntrenamientoDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public HorarioEntrenamiento updateHorario(Long horarioId, HorarioAsignacionRequestDTO horarioDTO, Long entrenadorId) {
        HorarioEntrenamiento horario = horarioRepository.findById(horarioId)
                .orElseThrow(() -> new EntityNotFoundException("Horario no encontrado con ID: " + horarioId));

        // Verificación de seguridad: Asegurarse de que el entrenador solo pueda editar sus propios horarios.
        if (!horario.getEntrenador().getId().equals(entrenadorId)) {
            throw new AccessDeniedException("No tienes permiso para editar este horario.");
        }

        Deportista deportista = deportistaRepository.findById(horarioDTO.getDeportistaId())
                .orElseThrow(() -> new EntityNotFoundException("Deportista no encontrado con ID: " + horarioDTO.getDeportistaId()));

        horario.setDia(horarioDTO.getDia());
        horario.setHorario(horarioDTO.getHorario());
        horario.setActividad(horarioDTO.getActividad());
        horario.setDeportista(deportista);

        return horarioRepository.save(horario);
    }

    @Transactional
    public void deleteHorario(Long horarioId, Long entrenadorId) {
        HorarioEntrenamiento horario = horarioRepository.findById(horarioId)
                .orElseThrow(() -> new EntityNotFoundException("Horario no encontrado con ID: " + horarioId));

        // Verificación de seguridad
        if (!horario.getEntrenador().getId().equals(entrenadorId)) {
            throw new AccessDeniedException("No tienes permiso para eliminar este horario.");
        }

        horarioRepository.deleteById(horarioId);
    }
}
