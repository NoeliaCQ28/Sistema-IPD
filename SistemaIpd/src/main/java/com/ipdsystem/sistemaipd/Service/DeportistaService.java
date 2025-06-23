package com.ipdsystem.sistemaipd.Service;

import com.ipdsystem.sistemaipd.Dto.DeportistaDetailDTO;
import com.ipdsystem.sistemaipd.Dto.DeportistaRequestDTO;
import com.ipdsystem.sistemaipd.Dto.DeportistaResponseDTO;
import com.ipdsystem.sistemaipd.Entity.Deportista;
import com.ipdsystem.sistemaipd.Entity.Entrenador; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import com.ipdsystem.sistemaipd.Repository.DeportistaRepository;
import com.ipdsystem.sistemaipd.Repository.EntrenadorRepository; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import jakarta.persistence.EntityNotFoundException; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!

import java.time.LocalDateTime;
import java.util.ArrayList; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import java.util.List;
import java.util.Optional;
import java.util.Set; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import java.util.stream.Collectors;

@Service
public class DeportistaService {

    @Autowired
    private DeportistaRepository deportistaRepository;

    @Autowired
    private EntrenadorRepository entrenadorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
                    // Cargar explícitamente las colecciones Lazy DENTRO de la transacción
                    // Asegúrate de que estas colecciones no sean nulas antes de acceder a ellas.
                    if (deportista.getHorariosEntrenamiento() != null) {
                        deportista.getHorariosEntrenamiento().size();
                    }
                    if (deportista.getEntrenador() != null) {
                        deportista.getEntrenador().getNombres();
                    }
                    if (deportista.getProgresos() != null) { // Asegúrate de que Deportista.java tiene esta colección
                        deportista.getProgresos().size(); // Inicializa la colección
                    }

                    // Convertir a DTO mientras la sesión de Hibernate aún está abierta
                    return DeportistaDetailDTO.fromEntity(deportista);
                });
    }

    @Transactional
    public DeportistaResponseDTO crearDeportista(DeportistaRequestDTO deportistaDTO) {
        Deportista deportista = new Deportista();
        deportista.setNombres(deportistaDTO.getNombres());
        deportista.setApellidos(deportistaDTO.getApellidos());
        deportista.setDni(deportistaDTO.getDni());
        deportista.setFechaNacimiento(deportistaDTO.getFechaNacimiento());
        deportista.setCorreo(deportistaDTO.getCorreo());
        deportista.setTelefono(deportistaDTO.getTelefono());
        deportista.setDisciplina(deportistaDTO.getDisciplina());
        deportista.setPeso(deportistaDTO.getPeso());

        // Asegúrate de que DeportistaRequestDTO NO TIENE fechaRegistro, activo, o password directamente
        // Estos campos se manejan en el servicio.
        deportista.setFechaRegistro(LocalDateTime.now()); // Fecha de registro actual
        deportista.setActivo(true); // Por defecto activo al crear

        // La contraseña se genera a partir del DNI y se hashea
        if (deportistaDTO.getDni() == null || deportistaDTO.getDni().isEmpty()) {
            throw new IllegalArgumentException("DNI es requerido para generar la contraseña inicial.");
        }
        deportista.setPassword(passwordEncoder.encode(deportistaDTO.getDni()));
        deportista.setRol("DEPORTISTA"); // Asigna el rol por defecto

        // Asignar entrenador si se proporciona
        if (deportistaDTO.getEntrenadorId() != null) {
            Entrenador entrenador = entrenadorRepository.findById(deportistaDTO.getEntrenadorId())
                    .orElseThrow(() -> new EntityNotFoundException("Entrenador no encontrado con ID: " + deportistaDTO.getEntrenadorId()));
            deportista.setEntrenador(entrenador);
        } else {
            deportista.setEntrenador(null); // Si no se asigna, establecer a null
        }

        Deportista savedDeportista = deportistaRepository.save(deportista);
        return DeportistaResponseDTO.fromEntity(savedDeportista);
    }

    @Transactional
    public DeportistaResponseDTO actualizarDeportista(Long id, DeportistaRequestDTO deportistaDTO) {
        return deportistaRepository.findById(id).map(deportista -> {
            deportista.setNombres(deportistaDTO.getNombres());
            deportista.setApellidos(deportistaDTO.getApellidos());
            deportista.setDni(deportistaDTO.getDni()); // Permitir actualizar DNI si es necesario
            deportista.setFechaNacimiento(deportistaDTO.getFechaNacimiento());
            deportista.setCorreo(deportistaDTO.getCorreo()); // Permitir actualizar Correo
            deportista.setTelefono(deportistaDTO.getTelefono());
            deportista.setDisciplina(deportistaDTO.getDisciplina());
            deportista.setPeso(deportistaDTO.getPeso());
            deportista.setActivo(deportistaDTO.isActivo()); // Permitir actualizar el estado activo

            // La contraseña y el rol no se actualizan desde este método general.
            // Si necesitas cambiar la contraseña, usa un endpoint específico (ej. ProfileController).

            if (deportistaDTO.getEntrenadorId() != null) {
                Entrenador entrenador = entrenadorRepository.findById(deportistaDTO.getEntrenadorId())
                        .orElseThrow(() -> new EntityNotFoundException("Entrenador no encontrado con ID: " + deportistaDTO.getEntrenadorId()));
                deportista.setEntrenador(entrenador);
            } else {
                deportista.setEntrenador(null);
            }

            Deportista updatedDeportista = deportistaRepository.save(deportista);
            return DeportistaResponseDTO.fromEntity(updatedDeportista);
        }).orElseThrow(() -> new EntityNotFoundException("Deportista no encontrado con ID: " + id));
    }

    public void eliminarDeportista(Long id) {
        deportistaRepository.deleteById(id);
    }
}