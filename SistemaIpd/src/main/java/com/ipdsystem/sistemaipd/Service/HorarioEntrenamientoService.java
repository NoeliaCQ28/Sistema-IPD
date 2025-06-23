package com.ipdsystem.sistemaipd.Service;

import com.ipdsystem.sistemaipd.Entity.HorarioEntrenamiento;
import com.ipdsystem.sistemaipd.Repository.HorarioEntrenamientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class HorarioEntrenamientoService {

    @Autowired
    private HorarioEntrenamientoRepository horarioEntrenamientoRepository;

    @Transactional(readOnly = true)
    public List<HorarioEntrenamiento> obtenerTodos() {
        return horarioEntrenamientoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<HorarioEntrenamiento> obtenerPorId(Long id) {
        return horarioEntrenamientoRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<HorarioEntrenamiento> getHorariosByDeportistaId(Long deportistaId) {
        return horarioEntrenamientoRepository.findByDeportistaId(deportistaId);
    }

    // Puedes añadir métodos para crear, actualizar, eliminar si se necesitan directamente desde aquí
}