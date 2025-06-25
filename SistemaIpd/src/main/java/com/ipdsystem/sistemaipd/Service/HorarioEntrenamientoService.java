package com.ipdsystem.sistemaipd.Service;

import com.ipdsystem.sistemaipd.Dto.HorarioEntrenamientoDTO; // <-- IMPORTACIÓN NUEVA
import com.ipdsystem.sistemaipd.Entity.HorarioEntrenamiento;
import com.ipdsystem.sistemaipd.Repository.HorarioEntrenamientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors; // <-- IMPORTACIÓN NUEVA

@Service
public class HorarioEntrenamientoService {

    @Autowired
    private HorarioEntrenamientoRepository horarioEntrenamientoRepository;

    @Transactional(readOnly = true)
    public List<HorarioEntrenamientoDTO> getHorariosByEntrenadorId(Long entrenadorId) {
        List<HorarioEntrenamiento> horarios = horarioEntrenamientoRepository.findByEntrenadorId(entrenadorId);
        return horarios.stream()
                .map(HorarioEntrenamientoDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // Los demás métodos se mantienen si los tienes...
}