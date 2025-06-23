package com.ipdsystem.sistemaipd.Repository;

import com.ipdsystem.sistemaipd.Entity.HorarioEntrenamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HorarioEntrenamientoRepository extends JpaRepository<HorarioEntrenamiento, Long> {
    List<HorarioEntrenamiento> findByDeportistaId(Long deportistaId);
    List<HorarioEntrenamiento> findByEntrenadorId(Long entrenadorId);
}