package com.ipdsystem.sistemaipd.Service;

import com.ipdsystem.sistemaipd.Dto.ProgresoDeportistaRequestDTO;
import com.ipdsystem.sistemaipd.Dto.ProgresoDeportistaResponseDTO;
import com.ipdsystem.sistemaipd.Entity.Deportista;
import com.ipdsystem.sistemaipd.Entity.Entrenador;
import com.ipdsystem.sistemaipd.Entity.ProgresoDeportista;
import com.ipdsystem.sistemaipd.Repository.DeportistaRepository;
import com.ipdsystem.sistemaipd.Repository.EntrenadorRepository;
import com.ipdsystem.sistemaipd.Repository.ProgresoDeportistaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProgresoDeportistaService {

    @Autowired
    private ProgresoDeportistaRepository progresoDeportistaRepository;

    @Autowired
    private DeportistaRepository deportistaRepository;

    @Autowired
    private EntrenadorRepository entrenadorRepository;

    @Transactional(readOnly = true)
    public List<ProgresoDeportistaResponseDTO> getProgresosByDeportistaId(Long deportistaId) {
        Deportista deportista = deportistaRepository.findById(deportistaId)
                .orElseThrow(() -> new EntityNotFoundException("Deportista no encontrado con ID: " + deportistaId));

        if (deportista.getProgresos() != null) {
            deportista.getProgresos().size();
        }

        return deportista.getProgresos().stream()
                .map(progreso -> {
                    if (progreso.getDeportista() != null) progreso.getDeportista().getNombres();
                    if (progreso.getEntrenador() != null) progreso.getEntrenador().getNombres();
                    return ProgresoDeportistaResponseDTO.fromEntity(progreso);
                })
                .collect(Collectors.toCollection(ArrayList::new));
    }

    @Transactional
    public ProgresoDeportista saveProgreso(ProgresoDeportista progreso) {
        return progresoDeportistaRepository.save(progreso);
    }

    @Transactional
    public ProgresoDeportistaResponseDTO actualizarProgreso(Long progresoId, ProgresoDeportistaRequestDTO requestDTO) {
        ProgresoDeportista progresoExistente = progresoDeportistaRepository.findById(progresoId)
                .orElseThrow(() -> new EntityNotFoundException("Registro de progreso no encontrado con ID: " + progresoId));

        if (requestDTO.getDeportistaId() != null && !progresoExistente.getDeportista().getId().equals(requestDTO.getDeportistaId())) {
            Deportista newDeportista = deportistaRepository.findById(requestDTO.getDeportistaId())
                    .orElseThrow(() -> new EntityNotFoundException("Deportista no encontrado con ID: " + requestDTO.getDeportistaId()));
            progresoExistente.setDeportista(newDeportista);
        }
        if (requestDTO.getEntrenadorId() != null && !progresoExistente.getEntrenador().getId().equals(requestDTO.getEntrenadorId())) {
            Entrenador newEntrenador = entrenadorRepository.findById(requestDTO.getEntrenadorId())
                    .orElseThrow(() -> new EntityNotFoundException("Entrenador no encontrado con ID: " + requestDTO.getEntrenadorId()));
            progresoExistente.setEntrenador(newEntrenador);
        }

        progresoExistente.setFechaRegistro(requestDTO.getFechaRegistro());
        progresoExistente.setTipoMebrica(requestDTO.getTipoMebrica());
        progresoExistente.setValor(requestDTO.getValor());
        progresoExistente.setObservaciones(requestDTO.getObservaciones());

        ProgresoDeportista updatedProgreso = progresoDeportistaRepository.save(progresoExistente);
        return ProgresoDeportistaResponseDTO.fromEntity(updatedProgreso);
    }

    @Transactional
    public void eliminarProgreso(Long progresoId) {
        if (!progresoDeportistaRepository.existsById(progresoId)) {
            throw new EntityNotFoundException("Registro de progreso no encontrado con ID: " + progresoId);
        }
        progresoDeportistaRepository.deleteById(progresoId);
    }

    @Transactional(readOnly = true)
    public Optional<ProgresoDeportistaResponseDTO> obtenerProgresoPorId(Long progresoId) {
        return progresoDeportistaRepository.findById(progresoId)
                .map(progreso -> {
                    if (progreso.getDeportista() != null) progreso.getDeportista().getNombres();
                    if (progreso.getEntrenador() != null) progreso.getEntrenador().getNombres();
                    return ProgresoDeportistaResponseDTO.fromEntity(progreso);
                });
    }

}