package com.ipdsystem.sistemaipd.Repository;

import com.ipdsystem.sistemaipd.Entity.ProgresoDeportista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgresoDeportistaRepository extends JpaRepository<ProgresoDeportista, Long> {
    List<ProgresoDeportista> findByDeportistaIdOrderByFechaRegistroDesc(Long deportistaId);
    List<ProgresoDeportista> findByEntrenadorIdOrderByFechaRegistroDesc(Long entrenadorId);
}