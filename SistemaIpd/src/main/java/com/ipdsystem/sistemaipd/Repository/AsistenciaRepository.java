package com.ipdsystem.sistemaipd.Repository;

import com.ipdsystem.sistemaipd.Entity.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

    /**
     * Busca todos los registros de asistencia para un deportista específico,
     * ordenados por fecha descendente.
     * @param deportistaId El ID del deportista.
     * @return Una lista de asistencias.
     */
    List<Asistencia> findByDeportistaIdOrderByFechaDesc(Long deportistaId);

    /**
     * Busca todos los registros de asistencia realizados por un entrenador específico.
     * @param entrenadorId El ID del entrenador.
     * @return Una lista de asistencias.
     */
    List<Asistencia> findByEntrenadorId(Long entrenadorId);

    /**
     * Busca los registros de asistencia para un entrenador en una fecha específica.
     * Esto será útil para mostrar la lista de asistencia del día.
     * @param entrenadorId El ID del entrenador.
     * @param fecha La fecha a consultar.
     * @return Una lista de asistencias para esa fecha y entrenador.
     */
    List<Asistencia> findByEntrenadorIdAndFecha(Long entrenadorId, LocalDate fecha);

    /**
     * Busca un registro de asistencia específico para un deportista en una fecha determinada.
     * Útil para evitar duplicados en un mismo día para el mismo deportista.
     * @param deportistaId El ID del deportista.
     * @param fecha La fecha a consultar.
     * @return Un Optional que contiene la asistencia si ya existe.
     */
    Optional<Asistencia> findByDeportistaIdAndFecha(Long deportistaId, LocalDate fecha);
}
