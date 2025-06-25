package com.ipdsystem.sistemaipd.Service;

import com.ipdsystem.sistemaipd.Dto.AsistenciaRequestDTO;
import com.ipdsystem.sistemaipd.Dto.AsistenciaResponseDTO;
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
     * @return Una lista de DTOs de asistencia ordenados por fecha.
     */
    @Transactional(readOnly = true)
    public List<AsistenciaResponseDTO> getHistorialDeAsistenciasPorDeportista(Long deportistaId) {
        List<Asistencia> asistencias = asistenciaRepository.findByDeportistaIdOrderByFechaDesc(deportistaId);
        return asistencias.stream()
                .map(AsistenciaResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene la lista de asistencias para una fecha y entrenador específicos.
     * Si no existen registros para esa fecha, los crea en memoria (sin guardarlos)
     * con un estado por defecto para que el entrenador pueda modificarlos.
     * @param entrenadorId El ID del entrenador que toma la asistencia.
     * @param fecha La fecha para la cual se quiere tomar asistencia.
     * @return Una lista de DTOs de asistencia, listos para ser mostrados en el frontend.
     */
    @Transactional
    public List<AsistenciaResponseDTO> getOrCreateAsistenciasParaFecha(Long entrenadorId, LocalDate fecha) {
        Entrenador entrenador = entrenadorRepository.findById(entrenadorId)
                .orElseThrow(() -> new EntityNotFoundException("Entrenador no encontrado con ID: " + entrenadorId));

        List<Deportista> deportistas = entrenador.getDeportistasACargo().stream().collect(Collectors.toList());

        return deportistas.stream().map(deportista -> {
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
     * Guarda o actualiza una lista de registros de asistencia.
     * Ideal para procesar el formulario de "Tomar Asistencia".
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
}
