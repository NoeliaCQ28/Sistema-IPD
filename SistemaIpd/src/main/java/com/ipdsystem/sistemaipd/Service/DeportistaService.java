package com.ipdsystem.sistemaipd.Service;

import com.ipdsystem.sistemaipd.Dto.DeportistaDetailDTO;
import com.ipdsystem.sistemaipd.Dto.DeportistaProfileUpdateDTO;
import com.ipdsystem.sistemaipd.Dto.DeportistaRequestDTO;
import com.ipdsystem.sistemaipd.Dto.DeportistaResponseDTO;
import com.ipdsystem.sistemaipd.Dto.ProgresoDeportistaResponseDTO;
import com.ipdsystem.sistemaipd.Entity.Deportista;
import com.ipdsystem.sistemaipd.Entity.Entrenador;
import com.ipdsystem.sistemaipd.Repository.DeportistaRepository;
import com.ipdsystem.sistemaipd.Repository.EntrenadorRepository;
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
public class DeportistaService {

    @Autowired
    private DeportistaRepository deportistaRepository;

    @Autowired
    private EntrenadorRepository entrenadorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ProgresoDeportistaService progresoDeportistaService;


    @Transactional(readOnly = true)
    public List<DeportistaResponseDTO> obtenerTodos() {
        return deportistaRepository.findAll().stream()
                .map(DeportistaResponseDTO::fromEntity)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    @Transactional(readOnly = true)
    public Optional<DeportistaDetailDTO> obtenerPorId(Long id) {
        return deportistaRepository.findById(id)
                .map(deportista -> {
                    // Carga explícita de colecciones Lazy
                    if (deportista.getHorariosEntrenamiento() != null) {
                        deportista.getHorariosEntrenamiento().size();
                    }
                    if (deportista.getEntrenador() != null) {
                        deportista.getEntrenador().getNombres();
                    }
                    if (deportista.getProgresos() != null) {
                        deportista.getProgresos().size();
                    }
                    return DeportistaDetailDTO.fromEntity(deportista);
                });
    }

    @Transactional
    public DeportistaResponseDTO crearDeportista(DeportistaRequestDTO deportistaDTO) {
        Deportista deportista = new Deportista();

        mapDtoToEntity(deportistaDTO, deportista);

        deportista.setFechaRegistro(LocalDateTime.now());
        deportista.setActivo(true);
        deportista.setPassword(passwordEncoder.encode(deportistaDTO.getDni()));
        deportista.setRol("DEPORTISTA");

        if (deportistaDTO.getEntrenadorId() != null) {
            Entrenador entrenador = entrenadorRepository.findById(deportistaDTO.getEntrenadorId())
                    .orElseThrow(() -> new EntityNotFoundException("Entrenador no encontrado con ID: " + deportistaDTO.getEntrenadorId()));
            deportista.setEntrenador(entrenador);
        }

        Deportista savedDeportista = deportistaRepository.save(deportista);
        return DeportistaResponseDTO.fromEntity(savedDeportista);
    }

    @Transactional
    public DeportistaResponseDTO actualizarDeportista(Long id, DeportistaRequestDTO deportistaDTO) {
        Deportista deportista = deportistaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Deportista no encontrado con ID: " + id));

        mapDtoToEntity(deportistaDTO, deportista);

        Deportista updatedDeportista = deportistaRepository.save(deportista);
        return DeportistaResponseDTO.fromEntity(updatedDeportista);
    }

    @Transactional
    public void eliminarDeportista(Long id) {
        if (!deportistaRepository.existsById(id)) {
            throw new EntityNotFoundException("Deportista no encontrado con ID: " + id);
        }
        deportistaRepository.deleteById(id);
    }

    /**
     * Actualiza el perfil de un deportista con los datos permitidos.
     * @param deportistaId El ID del deportista a actualizar.
     * @param profileDTO El DTO con la nueva información.
     * @return La entidad Deportista actualizada.
     */
    @Transactional
    public Deportista updateProfile(Long deportistaId, DeportistaProfileUpdateDTO profileDTO) {
        Deportista deportista = deportistaRepository.findById(deportistaId)
                .orElseThrow(() -> new EntityNotFoundException("Deportista no encontrado con ID: " + deportistaId));

        deportista.setCorreo(profileDTO.getCorreo());
        deportista.setTelefono(profileDTO.getTelefono());
        deportista.setPeso(profileDTO.getPeso());

        return deportistaRepository.save(deportista);
    }

    private void mapDtoToEntity(DeportistaRequestDTO dto, Deportista entity) {
        entity.setNombres(dto.getNombres());
        entity.setApellidos(dto.getApellidos());
        entity.setDni(dto.getDni());
        entity.setFechaNacimiento(dto.getFechaNacimiento());
        entity.setCorreo(dto.getCorreo());
        entity.setTelefono(dto.getTelefono());
        entity.setDisciplina(dto.getDisciplina());
        entity.setPeso(dto.getPeso());
        entity.setActivo(dto.isActivo());

        if (dto.getEntrenadorId() != null) {
            Entrenador entrenador = entrenadorRepository.findById(dto.getEntrenadorId())
                    .orElseThrow(() -> new EntityNotFoundException("Entrenador no encontrado con ID: " + dto.getEntrenadorId()));
            entity.setEntrenador(entrenador);
        } else {
            entity.setEntrenador(null);
        }
    }
}
