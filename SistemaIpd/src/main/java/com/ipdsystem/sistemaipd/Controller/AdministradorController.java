package com.ipdsystem.sistemaipd.Controller;

import com.ipdsystem.sistemaipd.Dto.AdministradorRequestDTO;
import com.ipdsystem.sistemaipd.Dto.AdministradorResponseDTO; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import com.ipdsystem.sistemaipd.Entity.Administrador;
import com.ipdsystem.sistemaipd.Service.AdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityNotFoundException; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!

import java.util.List;

@RestController
@RequestMapping("/api/v1/administradores")
public class AdministradorController {

    private final AdministradorService administradorService;

    @Autowired
    public AdministradorController(AdministradorService administradorService) {
        this.administradorService = administradorService;
    }

    @GetMapping
    public ResponseEntity<List<AdministradorResponseDTO>> obtenerTodosLosAdministradores() {
        return ResponseEntity.ok(administradorService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Administrador> obtenerAdministradorPorId(@PathVariable Long id) {
        return administradorService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Administrador> crearAdministrador(@RequestBody AdministradorRequestDTO administradorDTO) {
        return new ResponseEntity<>(administradorService.crearAdministrador(administradorDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Administrador> actualizarAdministrador(@PathVariable Long id, @RequestBody AdministradorRequestDTO administradorDTO) {
        return ResponseEntity.ok(administradorService.actualizarAdministrador(id, administradorDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarAdministrador(@PathVariable Long id) {
        administradorService.eliminarAdministrador(id);
        return ResponseEntity.noContent().build();
    }
}