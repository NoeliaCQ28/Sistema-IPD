package com.ipdsystem.sistemaipd.Controller;

import com.ipdsystem.sistemaipd.Dto.DeportistaAsignadoDTO;
import com.ipdsystem.sistemaipd.Dto.EntrenadorDetailDTO;
import com.ipdsystem.sistemaipd.Dto.EntrenadorRequestDTO;
import com.ipdsystem.sistemaipd.Dto.EntrenadorResponseDTO;
import com.ipdsystem.sistemaipd.Dto.HorarioAsignacionRequestDTO;
import com.ipdsystem.sistemaipd.Dto.ProgresoDeportistaRequestDTO; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import com.ipdsystem.sistemaipd.Dto.ProgresoDeportistaResponseDTO; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import com.ipdsystem.sistemaipd.Entity.Entrenador;
import com.ipdsystem.sistemaipd.Entity.HorarioEntrenamiento;
import com.ipdsystem.sistemaipd.Service.EntrenadorService;
import com.ipdsystem.sistemaipd.Service.ProgresoDeportistaService; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import org.springframework.security.core.userdetails.UserDetails; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import org.springframework.web.bind.annotation.*;
import com.ipdsystem.sistemaipd.Exception.EntityNotFoundException; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!

import java.util.List;

@RestController
@RequestMapping("/api/v1/entrenadores")
public class EntrenadorController {

    private final EntrenadorService entrenadorService;
    private final ProgresoDeportistaService progresoDeportistaService; // <<<--- ¡AÑADIR ESTA INYECCIÓN!

    @Autowired
    public EntrenadorController(EntrenadorService entrenadorService, ProgresoDeportistaService progresoDeportistaService) { // <<<--- ¡ACTUALIZAR CONSTRUCTOR!
        this.entrenadorService = entrenadorService;
        this.progresoDeportistaService = progresoDeportistaService; // <<<--- ¡ASIGNAR!
    }

    @GetMapping("/{id}/deportistas")
    public ResponseEntity<List<DeportistaAsignadoDTO>> getDeportistasAsignados(@PathVariable Long id) {
        List<DeportistaAsignadoDTO> deportistas = entrenadorService.getDeportistasAsignados(id);
        return ResponseEntity.ok(deportistas);
    }

    @GetMapping
    public ResponseEntity<List<EntrenadorResponseDTO>> obtenerTodosLosEntrenadores() {
        return ResponseEntity.ok(entrenadorService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntrenadorDetailDTO> obtenerEntrenadorPorId(@PathVariable Long id) {
        return entrenadorService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Entrenador> crearEntrenador(@RequestBody EntrenadorRequestDTO entrenadorDTO) {
        return new ResponseEntity<>(entrenadorService.crearEntrenador(entrenadorDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Entrenador> actualizarEntrenador(@PathVariable Long id, @RequestBody EntrenadorRequestDTO entrenadorDTO) {
        return ResponseEntity.ok(entrenadorService.actualizarEntrenador(id, entrenadorDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEntrenador(@PathVariable Long id) {
        entrenadorService.eliminarEntrenador(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{entrenadorId}/horarios-asignar")
    public ResponseEntity<HorarioEntrenamiento> asignarHorarioADeportista(
            @PathVariable Long entrenadorId,
            @RequestBody HorarioAsignacionRequestDTO requestDTO,
            @AuthenticationPrincipal UserDetails currentUser) { // <<<--- ¡AÑADIR UserDetails!
        try {
            // Validar que el entrenadorId del PathVariable coincida con el ID del entrenador autenticado
            if (currentUser instanceof Entrenador) {
                Entrenador authEntrenador = (Entrenador) currentUser;
                if (!authEntrenador.getId().equals(entrenadorId)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 403 Forbidden
                }
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // Solo entrenadores pueden usar esto
            }

            HorarioEntrenamiento nuevoHorario = entrenadorService.asignarHorarioADeportista(entrenadorId, requestDTO);
            return new ResponseEntity<>(nuevoHorario, HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // --- NUEVOS ENDPOINTS PARA GESTIÓN DE PROGRESO ---
    @PostMapping("/{entrenadorId}/progresos")
    public ResponseEntity<ProgresoDeportistaResponseDTO> registrarProgreso(
            @PathVariable Long entrenadorId,
            @RequestBody ProgresoDeportistaRequestDTO requestDTO,
            @AuthenticationPrincipal UserDetails currentUser) {

        // Validar que el entrenadorId del PathVariable coincida con el ID del entrenador autenticado
        if (currentUser instanceof Entrenador) {
            Entrenador authEntrenador = (Entrenador) currentUser;
            if (!authEntrenador.getId().equals(entrenadorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            ProgresoDeportistaResponseDTO progreso = entrenadorService.registrarProgresoDeportista(entrenadorId, requestDTO);
            return new ResponseEntity<>(progreso, HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{entrenadorId}/progresos/{progresoId}")
    public ResponseEntity<ProgresoDeportistaResponseDTO> actualizarProgreso(
            @PathVariable Long entrenadorId,
            @PathVariable Long progresoId,
            @RequestBody ProgresoDeportistaRequestDTO requestDTO,
            @AuthenticationPrincipal UserDetails currentUser) {

        if (currentUser instanceof Entrenador) {
            Entrenador authEntrenador = (Entrenador) currentUser;
            if (!authEntrenador.getId().equals(entrenadorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            ProgresoDeportistaResponseDTO updatedProgreso = progresoDeportistaService.actualizarProgreso(progresoId, requestDTO);
            return ResponseEntity.ok(updatedProgreso);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{entrenadorId}/progresos/{progresoId}")
    public ResponseEntity<Void> eliminarProgreso(
            @PathVariable Long entrenadorId,
            @PathVariable Long progresoId,
            @AuthenticationPrincipal UserDetails currentUser) {

        if (currentUser instanceof Entrenador) {
            Entrenador authEntrenador = (Entrenador) currentUser;
            if (!authEntrenador.getId().equals(entrenadorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            progresoDeportistaService.eliminarProgreso(progresoId);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}