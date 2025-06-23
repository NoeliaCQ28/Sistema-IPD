package com.ipdsystem.sistemaipd.Controller;

import com.ipdsystem.sistemaipd.Dto.EventoRequestDTO;
import com.ipdsystem.sistemaipd.Entity.Evento;
import com.ipdsystem.sistemaipd.Service.EventoService; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityNotFoundException; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/eventos")
public class EventoController {

    @Autowired
    private EventoService eventoService; // <<<--- Asegúrate de que EventoService esté inyectado

    @GetMapping
    public ResponseEntity<List<Evento>> obtenerTodosLosEventos() {
        return ResponseEntity.ok(eventoService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Evento> obtenerEventoPorId(@PathVariable Long id) {
        Optional<Evento> evento = eventoService.obtenerPorId(id);
        return evento.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/por-disciplina/{disciplina}")
    public ResponseEntity<List<Evento>> getEventosPorDisciplina(@PathVariable String disciplina) {
        List<Evento> eventos = eventoService.getEventosPorDisciplina(disciplina);
        return ResponseEntity.ok(eventos);
    }

    @PostMapping
    public ResponseEntity<Evento> crearEvento(@RequestBody EventoRequestDTO eventoDTO) {
        Evento nuevoEvento = eventoService.crearEvento(eventoDTO);
        return new ResponseEntity<>(nuevoEvento, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Evento> actualizarEvento(@PathVariable Long id, @RequestBody EventoRequestDTO eventoDTO) {
        Evento eventoActualizado = eventoService.actualizarEvento(id, eventoDTO);
        return ResponseEntity.ok(eventoActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEvento(@PathVariable Long id) {
        eventoService.eliminarEvento(id);
        return ResponseEntity.noContent().build();
    }
}