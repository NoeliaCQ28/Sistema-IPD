package com.ipdsystem.sistemaipd.Service;

import com.ipdsystem.sistemaipd.Dto.DeportistaAsignadoDTO;
import com.ipdsystem.sistemaipd.Dto.EntrenadorDetailDTO;
import com.ipdsystem.sistemaipd.Dto.EntrenadorRequestDTO;
import com.ipdsystem.sistemaipd.Dto.EntrenadorResponseDTO;
import com.ipdsystem.sistemaipd.Dto.HorarioAsignacionRequestDTO;
import com.ipdsystem.sistemaipd.Dto.ProgresoDeportistaRequestDTO;
import com.ipdsystem.sistemaipd.Dto.ProgresoDeportistaResponseDTO;
import com.ipdsystem.sistemaipd.Entity.Deportista;
import com.ipdsystem.sistemaipd.Entity.Entrenador;
import com.ipdsystem.sistemaipd.Entity.HorarioEntrenamiento;
import com.ipdsystem.sistemaipd.Entity.ProgresoDeportista;
import com.ipdsystem.sistemaipd.Repository.DeportistaRepository;
import com.ipdsystem.sistemaipd.Repository.EntrenadorRepository;
import com.ipdsystem.sistemaipd.Repository.HorarioEntrenamientoRepository;
import com.ipdsystem.sistemaipd.Repository.ProgresoDeportistaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EntrenadorService {

    private final EntrenadorRepository entrenadorRepository;
    private final DeportistaRepository deportistaRepository;
    private final HorarioEntrenamientoRepository horarioEntrenamientoRepository;
    private final ProgresoDeportistaRepository progresoDeportistaRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public EntrenadorService(EntrenadorRepository entrenadorRepository, PasswordEncoder passwordEncoder,
                             DeportistaRepository deportistaRepository, HorarioEntrenamientoRepository horarioEntrenamientoRepository,
                             ProgresoDeportistaRepository progresoDeportistaRepository) {
        this.entrenadorRepository = entrenadorRepository;
        this.passwordEncoder = passwordEncoder;
        this.deportistaRepository = deportistaRepository;
        this.horarioEntrenamientoRepository = horarioEntrenamientoRepository;
        this.progresoDeportistaRepository = progresoDeportistaRepository;
    }

    @Transactional(readOnly = true)
    public List<DeportistaAsignadoDTO> getDeportistasAsignados(Long entrenadorId) {
        Entrenador entrenador = entrenadorRepository.findById(entrenadorId)
                .orElseThrow(() -> new EntityNotFoundException("Entrenador no encontrado con ID: " + entrenadorId));

        if (entrenador.getDeportistasACargo() != null) {
            entrenador.getDeportistasACargo().size();
        }

        return entrenador.getDeportistasACargo().stream()
                .map(DeportistaAsignadoDTO::fromEntity)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    @Transactional(readOnly = true)
    public List<EntrenadorResponseDTO> obtenerTodos() {
        return entrenadorRepository.findAll().stream().map(this::convertirAResponseDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<EntrenadorDetailDTO> obtenerPorId(Long id) {
        return entrenadorRepository.findById(id).map(entrenador -> {
            if (entrenador.getDeportistasACargo() != null) {
                entrenador.getDeportistasACargo().size();
            }
            if (entrenador.getHorariosCreados() != null) {
                entrenador.getHorariosCreados().size();
            }
            if (entrenador.getProgresosRegistrados() != null) {
                entrenador.getProgresosRegistrados().size();
                entrenador.getProgresosRegistrados().forEach(progreso -> {
                    if(progreso.getDeportista() != null) progreso.getDeportista().getNombres();
                    if(progreso.getEntrenador() != null) progreso.getEntrenador().getNombres();
                });
            }
            return EntrenadorDetailDTO.fromEntity(entrenador);
        });
    }

    @Transactional
    public Entrenador crearEntrenador(EntrenadorRequestDTO entrenadorDTO) {
        Entrenador nuevoEntrenador = new Entrenador();
        mapDtoToEntity(entrenadorDTO, nuevoEntrenador);
        nuevoEntrenador.setActivo(true);
        nuevoEntrenador.setFechaContratacion(LocalDateTime.now());
        nuevoEntrenador.setPassword(passwordEncoder.encode(entrenadorDTO.getDni()));
        return entrenadorRepository.save(nuevoEntrenador);
    }

    @Transactional
    public Entrenador actualizarEntrenador(Long id, EntrenadorRequestDTO entrenadorDTO) {
        Entrenador entrenadorExistente = entrenadorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Entrenador no encontrado con ID: " + id));
        mapDtoToEntity(entrenadorDTO, entrenadorExistente);
        return entrenadorRepository.save(entrenadorExistente);
    }

    @Transactional
    public void eliminarEntrenador(Long id) {
        if (!entrenadorRepository.existsById(id)) {
            throw new EntityNotFoundException("Entrenador no encontrado con ID: " + id);
        }
        entrenadorRepository.deleteById(id);
    }

    @Transactional
    public HorarioEntrenamiento asignarHorarioADeportista(Long entrenadorId, HorarioAsignacionRequestDTO requestDTO) {
        Entrenador entrenador = entrenadorRepository.findById(entrenadorId)
                .orElseThrow(() -> new EntityNotFoundException("Entrenador no encontrado con ID: " + entrenadorId));

        Deportista deportista = deportistaRepository.findById(requestDTO.getDeportistaId())
                .orElseThrow(() -> new EntityNotFoundException("Deportista no encontrado con ID: " + requestDTO.getDeportistaId()));

        if (!entrenador.getDeportistasACargo().contains(deportista)) {
            throw new IllegalArgumentException("El deportista no está asignado a este entrenador.");
        }

        HorarioEntrenamiento nuevoHorario = new HorarioEntrenamiento();
        nuevoHorario.setDia(requestDTO.getDia());
        nuevoHorario.setHorario(requestDTO.getHorario());
        nuevoHorario.setActividad(requestDTO.getActividad());
        nuevoHorario.setDeportista(deportista);
        nuevoHorario.setEntrenador(entrenador);

        return horarioEntrenamientoRepository.save(nuevoHorario);
    }

    @Transactional
    public ProgresoDeportistaResponseDTO registrarProgresoDeportista(Long entrenadorId, ProgresoDeportistaRequestDTO requestDTO) {
        Entrenador entrenador = entrenadorRepository.findById(entrenadorId)
                .orElseThrow(() -> new EntityNotFoundException("Entrenador no encontrado con ID: " + entrenadorId));

        Deportista deportista = deportistaRepository.findById(requestDTO.getDeportistaId())
                .orElseThrow(() -> new EntityNotFoundException("Deportista no encontrado con ID: " + requestDTO.getDeportistaId()));

        if (!entrenador.getDeportistasACargo().contains(deportista)) {
            throw new IllegalArgumentException("El deportista no está asignado a este entrenador.");
        }

        ProgresoDeportista progreso = new ProgresoDeportista();
        progreso.setDeportista(deportista);
        progreso.setEntrenador(entrenador);
        progreso.setFechaRegistro(requestDTO.getFechaRegistro());
        progreso.setTipoMebrica(requestDTO.getTipoMebrica());
        progreso.setValor(requestDTO.getValor());
        progreso.setObservaciones(requestDTO.getObservaciones());

        ProgresoDeportista savedProgreso = progresoDeportistaRepository.save(progreso);
        return ProgresoDeportistaResponseDTO.fromEntity(savedProgreso);
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

    private void mapDtoToEntity(EntrenadorRequestDTO dto, Entrenador entity) {
        entity.setNombres(dto.getNombres());
        entity.setApellidos(dto.getApellidos());
        entity.setDni(dto.getDni());
        entity.setCorreo(dto.getCorreo());
        entity.setFechaNacimiento(dto.getFechaNacimiento());
        entity.setTelefono(dto.getTelefono());
        entity.setDisciplinaQueEntrena(dto.getDisciplinaQueEntrena());
        entity.setProfesion(dto.getProfesion());
    }

    private EntrenadorResponseDTO convertirAResponseDto(Entrenador entrenador) {
        EntrenadorResponseDTO dto = new EntrenadorResponseDTO();
        dto.setId(entrenador.getId());
        dto.setNombres(entrenador.getNombres());
        dto.setApellidos(entrenador.getApellidos());
        dto.setDni(entrenador.getDni());
        dto.setCorreo(entrenador.getCorreo());
        dto.setDisciplinaQueEntrena(entrenador.getDisciplinaQueEntrena());
        return dto;
    }
}