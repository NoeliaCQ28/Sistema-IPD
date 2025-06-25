package com.ipdsystem.sistemaipd.Service;

import com.ipdsystem.sistemaipd.Dto.ProgresoDataDTO;
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

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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

    /**
     * Obtiene los datos de progreso listos para ser consumidos por un gráfico.
     * @param deportistaIds La lista de IDs de deportistas a consultar.
     * @param tipoMebrica La métrica específica que se quiere graficar.
     * @param fechaInicio La fecha de inicio del período de análisis.
     * @param fechaFin La fecha de fin del período de análisis.
     * @return Un mapa donde la clave es el nombre completo del deportista y el valor es una lista de sus puntos de datos (fecha y valor).
     */
    @Transactional(readOnly = true)
    public Map<String, List<ProgresoDataDTO>> getProgresoParaGrafico(List<Long> deportistaIds, String tipoMebrica, LocalDate fechaInicio, LocalDate fechaFin) {

        List<ProgresoDeportista> progresos = progresoDeportistaRepository.findProgresoForChart(deportistaIds, tipoMebrica, fechaInicio, fechaFin);

        // Convertimos las entidades a DTOs para el gráfico.
        List<ProgresoDataDTO> dataPoints = progresos.stream()
                .map(p -> new ProgresoDataDTO(
                        p.getDeportista().getNombres() + " " + p.getDeportista().getApellidos(),
                        p.getFechaRegistro(),
                        p.getValor()
                ))
                .collect(Collectors.toList());

        // Agrupamos los puntos de datos por el nombre del deportista.
        // Esto crea una serie de datos separada para cada deportista en el gráfico.
        return dataPoints.stream()
                .collect(Collectors.groupingBy(ProgresoDataDTO::getDeportistaNombre));
    }

    @Transactional(readOnly = true)
    public List<ProgresoDeportistaResponseDTO> getProgresosByEntrenadorId(Long entrenadorId) {
        List<ProgresoDeportista> progresos = progresoDeportistaRepository.findByEntrenadorIdOrderByFechaRegistroDesc(entrenadorId);
        List<ProgresoDeportistaResponseDTO> dtos = new ArrayList<>();
        for (ProgresoDeportista progreso : progresos) {
            dtos.add(ProgresoDeportistaResponseDTO.fromEntity(progreso));
        }
        return dtos;
    }

    @Transactional(readOnly = true)
    public List<ProgresoDeportistaResponseDTO> getProgresosByDeportistaId(Long deportistaId) {
        Deportista deportista = deportistaRepository.findById(deportistaId)
                .orElseThrow(() -> new EntityNotFoundException("Deportista no encontrado con ID: " + deportistaId));

        List<ProgresoDeportista> progresos = deportista.getProgresos().stream().toList();

        for (ProgresoDeportista progreso : progresos) {
            if (progreso.getEntrenador() != null) {
                progreso.getEntrenador().getNombres();
            }
        }

        return progresos.stream()
                .map(ProgresoDeportistaResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProgresoDeportistaResponseDTO actualizarProgreso(Long progresoId, ProgresoDeportistaRequestDTO requestDTO) {
        ProgresoDeportista progresoExistente = progresoDeportistaRepository.findById(progresoId)
                .orElseThrow(() -> new EntityNotFoundException("Registro de progreso no encontrado con ID: " + progresoId));

        if (requestDTO.getDeportistaId() != null) {
            Deportista newDeportista = deportistaRepository.findById(requestDTO.getDeportistaId())
                    .orElseThrow(() -> new EntityNotFoundException("Deportista no encontrado con ID: " + requestDTO.getDeportistaId()));
            progresoExistente.setDeportista(newDeportista);
        }
        if (requestDTO.getEntrenadorId() != null) {
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
                .map(ProgresoDeportistaResponseDTO::fromEntity);
    }
}
