package com.ipdsystem.sistemaipd.Repository;

import com.ipdsystem.sistemaipd.Entity.ProgresoDeportista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProgresoDeportistaRepository extends JpaRepository<ProgresoDeportista, Long> {

    /**
     * Busca todos los registros de progreso para un deportista específico,
     * ordenados por fecha descendente.
     * @param deportistaId El ID del deportista.
     * @return Una lista de progresos.
     */
    List<ProgresoDeportista> findByDeportistaIdOrderByFechaRegistroDesc(Long deportistaId);

    /**
     * Busca todos los registros de progreso realizados por un entrenador específico,
     * ordenados por fecha descendente.
     * @param entrenadorId El ID del entrenador.
     * @return Una lista de progresos.
     */
    List<ProgresoDeportista> findByEntrenadorIdOrderByFechaRegistroDesc(Long entrenadorId);

    /**
     * Busca los registros de progreso que coinciden con una lista de IDs de deportistas,
     * un tipo de métrica específico y un rango de fechas.
     * Los resultados se ordenan por fecha de forma ascendente, ideal para un gráfico de líneas.
     * * @param deportistaIds Lista de IDs de los deportistas a consultar.
     * @param tipoMebrica La métrica específica a filtrar (ej. "Peso Levantado (kg)").
     * @param fechaInicio La fecha de inicio del rango de búsqueda.
     * @param fechaFin La fecha de fin del rango de búsqueda.
     * @return Una lista de entidades ProgresoDeportista que coinciden con los criterios.
     */
    @Query("SELECT p FROM ProgresoDeportista p WHERE p.deportista.id IN :deportistaIds AND p.tipoMebrica = :tipoMebrica AND p.fechaRegistro BETWEEN :fechaInicio AND :fechaFin ORDER BY p.fechaRegistro ASC")
    List<ProgresoDeportista> findProgresoForChart(
            @Param("deportistaIds") List<Long> deportistaIds,
            @Param("tipoMebrica") String tipoMebrica,
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin
    );
}
