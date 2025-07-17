package com.ipdsystem.sistemaipd.Controller;

import com.ipdsystem.sistemaipd.Dto.TorneoRequestDTO;
import com.ipdsystem.sistemaipd.Entity.Deportista;
import com.ipdsystem.sistemaipd.Entity.Torneo;
import com.ipdsystem.sistemaipd.Service.TorneoService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/torneos")
public class TorneoController {

    @Autowired
    private TorneoService torneoService;

    // --- MÉTODOS EXISTENTES (sin cambios) ---

    @GetMapping
    public ResponseEntity<List<Torneo>> obtenerTodosLosTorneos() {
        return ResponseEntity.ok(torneoService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Torneo> obtenerTorneoPorId(@PathVariable Long id) {
        Optional<Torneo> torneo = torneoService.obtenerPorId(id);
        return torneo.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Torneo> crearTorneo(@RequestBody TorneoRequestDTO torneoDTO) {
        Torneo nuevoTorneo = torneoService.crearTorneo(torneoDTO);
        return new ResponseEntity<>(nuevoTorneo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Torneo> actualizarTorneo(@PathVariable Long id, @RequestBody TorneoRequestDTO torneoDTO) {
        Torneo torneoActualizado = torneoService.actualizarTorneo(id, torneoDTO);
        return ResponseEntity.ok(torneoActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTorneo(@PathVariable Long id) {
        torneoService.eliminarTorneo(id);
        return ResponseEntity.noContent().build();
    }


    // --- NUEVOS ENDPOINTS PARA INSCRIPCIONES ---

    /**
     * Inscribe al deportista autenticado en un torneo.
     */
    @PostMapping("/{torneoId}/inscribir")
    public ResponseEntity<?> inscribirDeportista(
            @PathVariable Long torneoId,
            @AuthenticationPrincipal UserDetails currentUser) {

        if (!(currentUser instanceof Deportista)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Solo los deportistas pueden inscribirse."));
        }

        Long deportistaId = ((Deportista) currentUser).getId();

        try {
            torneoService.inscribirDeportista(torneoId, deportistaId);
            return ResponseEntity.ok(Map.of("message", "Inscripción exitosa."));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Ocurrió un error al procesar la inscripción."));
        }
    }

    /**
     * Anula la inscripción del deportista autenticado en un torneo.
     */
    @PostMapping("/{torneoId}/anular-inscripcion")
    public ResponseEntity<?> anularInscripcion(
            @PathVariable Long torneoId,
            @AuthenticationPrincipal UserDetails currentUser) {

        if (!(currentUser instanceof Deportista)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Solo los deportistas pueden anular inscripciones."));
        }

        Long deportistaId = ((Deportista) currentUser).getId();

        try {
            torneoService.anularInscripcion(torneoId, deportistaId);
            return ResponseEntity.ok(Map.of("message", "Inscripción anulada correctamente."));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Ocurrió un error al anular la inscripción."));
        }
    }
}