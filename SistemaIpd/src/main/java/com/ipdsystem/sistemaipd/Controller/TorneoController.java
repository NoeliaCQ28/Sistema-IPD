package com.ipdsystem.sistemaipd.Controller;

import com.ipdsystem.sistemaipd.Dto.TorneoRequestDTO;
import com.ipdsystem.sistemaipd.Entity.Torneo;
import com.ipdsystem.sistemaipd.Service.TorneoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/torneos")
public class TorneoController {

    @Autowired
    private TorneoService torneoService;

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
}