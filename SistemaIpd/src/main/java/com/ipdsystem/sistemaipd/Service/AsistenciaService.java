package com.ipdsystem.sistemaipd.Service;

import com.ipdsystem.sistemaipd.Dto.AsistenciaRequestDTO;
import com.ipdsystem.sistemaipd.Dto.AsistenciaResponseDTO;
import com.ipdsystem.sistemaipd.Dto.AsistenciaStatsDTO;
import com.ipdsystem.sistemaipd.Entity.Asistencia;
import com.ipdsystem.sistemaipd.Entity.Deportista;
import com.ipdsystem.sistemaipd.Entity.Entrenador;
import com.ipdsystem.sistemaipd.Repository.AsistenciaRepository;
import com.ipdsystem.sistemaipd.Repository.DeportistaRepository;
import com.ipdsystem.sistemaipd.Repository.EntrenadorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AsistenciaService {

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @Autowired
    private DeportistaRepository deportistaRepository;

    @Autowired
    private EntrenadorRepository entrenadorRepository;

    /**
     * Obtiene el historial completo de asistencias para un deportista.
     * @param deportistaId El ID del deportista.
     * @return Una lista de DTOs de asistencia.
     */
    @Transactional(readOnly = true)
    public List<AsistenciaResponseDTO> getHistorialDeAsistenciasPorDeportista(Long deportistaId) {
        List<Asistencia> asistencias = asistenciaRepository.findByDeportistaIdOrderByFechaDesc(deportistaId);
        return asistencias.stream()
                .map(AsistenciaResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene la lista de deportistas para tomar asistencia en una fecha específica.
     * Si no hay registro, crea uno en memoria para ser modificado.
     * @param entrenadorId El ID del entrenador.
     * @param fecha La fecha de la asistencia.
     * @return Una lista de DTOs listos para el formulario.
     */
    @Transactional
    public List<AsistenciaResponseDTO> getOrCreateAsistenciasParaFecha(Long entrenadorId, LocalDate fecha) {
        Entrenador entrenador = entrenadorRepository.findById(entrenadorId)
                .orElseThrow(() -> new EntityNotFoundException("Entrenador no encontrado con ID: " + entrenadorId));

        return entrenador.getDeportistasACargo().stream().map(deportista -> {
            Asistencia asistencia = asistenciaRepository
                    .findByDeportistaIdAndFecha(deportista.getId(), fecha)
                    .orElseGet(() -> {
                        Asistencia nuevaAsistencia = new Asistencia();
                        nuevaAsistencia.setDeportista(deportista);
                        nuevaAsistencia.setEntrenador(entrenador);
                        nuevaAsistencia.setFecha(fecha);
                        nuevaAsistencia.setEstado(Asistencia.EstadoAsistencia.AUSENTE); // Estado por defecto
                        return nuevaAsistencia;
                    });
            return AsistenciaResponseDTO.fromEntity(asistencia);
        }).collect(Collectors.toList());
    }

    /**
     * Guarda o actualiza múltiples registros de asistencia.
     * @param entrenadorId El ID del entrenador que registra.
     * @param asistenciasDTO La lista de asistencias a guardar.
     */
    @Transactional
    public void registrarOActualizarAsistencias(Long entrenadorId, List<AsistenciaRequestDTO> asistenciasDTO) {
        Entrenador entrenador = entrenadorRepository.findById(entrenadorId)
                .orElseThrow(() -> new EntityNotFoundException("Entrenador no encontrado con ID: " + entrenadorId));

        for (AsistenciaRequestDTO dto : asistenciasDTO) {
            Deportista deportista = deportistaRepository.findById(dto.getDeportistaId())
                    .orElseThrow(() -> new EntityNotFoundException("Deportista no encontrado con ID: " + dto.getDeportistaId()));

            if (!deportista.getEntrenador().getId().equals(entrenadorId)) {
                throw new SecurityException("El deportista con ID " + deportista.getId() + " no está asignado a este entrenador.");
            }

            Asistencia asistencia = asistenciaRepository
                    .findByDeportistaIdAndFecha(dto.getDeportistaId(), dto.getFecha())
                    .orElse(new Asistencia());

            asistencia.setDeportista(deportista);
            asistencia.setEntrenador(entrenador);
            asistencia.setFecha(dto.getFecha());
            asistencia.setEstado(dto.getEstado());

            asistenciaRepository.save(asistencia);
        }
    }

    /**
     * Calcula y devuelve las estadísticas de asistencia para todos los deportistas
     * de un entrenador en un rango de fechas específico.
     * @param entrenadorId El ID del entrenador.
     * @param fechaInicio La fecha de inicio del reporte.
     * @param fechaFin La fecha de fin del reporte.
     * @return Una lista con las estadísticas de cada deportista.
     */
    @Transactional(readOnly = true)
    public List<AsistenciaStatsDTO> getReporteAsistencia(Long entrenadorId, LocalDate fechaInicio, LocalDate fechaFin) {
        Entrenador entrenador = entrenadorRepository.findById(entrenadorId)
                .orElseThrow(() -> new EntityNotFoundException("Entrenador no encontrado"));

        List<AsistenciaStatsDTO> estadisticas = new ArrayList<>();

        for (Deportista deportista : entrenador.getDeportistasACargo()) {
            List<Asistencia> asistencias = asistenciaRepository.findByDeportistaIdOrderByFechaDesc(deportista.getId());

            List<Asistencia> asistenciasFiltradas = asistencias.stream()
                    .filter(a -> !a.getFecha().isBefore(fechaInicio) && !a.getFecha().isAfter(fechaFin))
                    .toList();

            long totalPresente = asistenciasFiltradas.stream().filter(a -> a.getEstado() == Asistencia.EstadoAsistencia.PRESENTE).count();
            long totalAusente = asistenciasFiltradas.stream().filter(a -> a.getEstado() == Asistencia.EstadoAsistencia.AUSENTE).count();
            long totalJustificado = asistenciasFiltradas.stream().filter(a -> a.getEstado() == Asistencia.EstadoAsistencia.JUSTIFICADO).count();
            long totalRegistros = asistenciasFiltradas.size();

            double porcentaje = (totalRegistros == 0) ? 0 : ((double) totalPresente / totalRegistros) * 100;

            estadisticas.add(new AsistenciaStatsDTO(
                    deportista.getId(),
                    deportista.getNombres() + " " + deportista.getApellidos(),
                    totalPresente,
                    totalAusente,
                    totalJustificado,
                    totalRegistros,
                    Math.round(porcentaje * 100.0) / 100.0 // Redondeamos a 2 decimales
            ));
        }

        return estadisticas;
    }
}
