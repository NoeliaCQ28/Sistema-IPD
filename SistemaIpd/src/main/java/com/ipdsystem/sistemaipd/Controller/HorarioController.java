package com.ipdsystem.sistemaipd.Controller;

import com.ipdsystem.sistemaipd.Dto.HorarioAsignacionRequestDTO;
import com.ipdsystem.sistemaipd.Entity.Entrenador;
import com.ipdsystem.sistemaipd.Entity.HorarioEntrenamiento;
import com.ipdsystem.sistemaipd.Service.HorarioEntrenamientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/horarios")
public class HorarioController {

    @Autowired
    private HorarioEntrenamientoService horarioService;

    // Endpoint para ACTUALIZAR un horario existente
    @PutMapping("/{id}")
    public ResponseEntity<HorarioEntrenamiento> updateHorario(
            @PathVariable Long id,
            @RequestBody HorarioAsignacionRequestDTO horarioDTO,
            @AuthenticationPrincipal UserDetails currentUser) {

        // Obtenemos el ID del entrenador autenticado para seguridad
        Long entrenadorId = ((Entrenador) currentUser).getId();
        HorarioEntrenamiento updatedHorario = horarioService.updateHorario(id, horarioDTO, entrenadorId);
        return ResponseEntity.ok(updatedHorario);
    }

    // Endpoint para ELIMINAR un horario existente
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHorario(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails currentUser) {

        Long entrenadorId = ((Entrenador) currentUser).getId();
        horarioService.deleteHorario(id, entrenadorId);
        return ResponseEntity.noContent().build();
    }
}
