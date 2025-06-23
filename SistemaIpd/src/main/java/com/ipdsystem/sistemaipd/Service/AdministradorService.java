package com.ipdsystem.sistemaipd.Service;

import com.ipdsystem.sistemaipd.Dto.AdministradorRequestDTO;
import com.ipdsystem.sistemaipd.Dto.AdministradorResponseDTO; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import com.ipdsystem.sistemaipd.Entity.Administrador;
import com.ipdsystem.sistemaipd.Repository.AdministradorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdministradorService {

    private final AdministradorRepository administradorRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdministradorService(AdministradorRepository administradorRepository, PasswordEncoder passwordEncoder) {
        this.administradorRepository = administradorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<AdministradorResponseDTO> obtenerTodos() {
        return administradorRepository.findAll().stream()
                .map(this::convertirAResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<Administrador> obtenerPorId(Long id) {
        return administradorRepository.findById(id);
    }

    @Transactional
    public Administrador crearAdministrador(AdministradorRequestDTO administradorDTO) {
        Administrador nuevoAdmin = new Administrador();
        mapDtoToEntity(administradorDTO, nuevoAdmin);
        nuevoAdmin.setFechaRegistro(LocalDateTime.now());
        nuevoAdmin.setActivo(true);
        nuevoAdmin.setPassword(passwordEncoder.encode(administradorDTO.getPassword())); // Asegura que la contraseña se hashea
        nuevoAdmin.setRol("ADMINISTRADOR");
        return administradorRepository.save(nuevoAdmin);
    }

    @Transactional
    public Administrador actualizarAdministrador(Long id, AdministradorRequestDTO administradorDTO) {
        Administrador adminExistente = administradorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Administrador no encontrado con ID: " + id));
        mapDtoToEntity(administradorDTO, adminExistente);
        // La contraseña no se actualiza desde este método. Si quieres cambiarla, necesitarías un endpoint y DTO específicos.
        return administradorRepository.save(adminExistente);
    }

    @Transactional
    public void eliminarAdministrador(Long id) {
        if (!administradorRepository.existsById(id)) {
            throw new EntityNotFoundException("Administrador no encontrado con ID: " + id);
        }
        administradorRepository.deleteById(id);
    }

    private void mapDtoToEntity(AdministradorRequestDTO dto, Administrador entity) {
        entity.setNombres(dto.getNombres());
        entity.setApellidos(dto.getApellidos());
        entity.setDni(dto.getDni());
        entity.setCorreo(dto.getCorreo());
        entity.setTelefono(dto.getTelefono());
        entity.setFechaNacimiento(dto.getFechaNacimiento());
    }

    // Método auxiliar para convertir a DTO de respuesta
    private AdministradorResponseDTO convertirAResponseDto(Administrador admin) {
        AdministradorResponseDTO dto = new AdministradorResponseDTO();
        dto.setId(admin.getId());
        dto.setNombres(admin.getNombres());
        dto.setApellidos(admin.getApellidos());
        dto.setCorreo(admin.getCorreo());
        dto.setDni(admin.getDni());
        return dto;
    }
}