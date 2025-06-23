package com.ipdsystem.sistemaipd.Controller;

import com.ipdsystem.sistemaipd.Dto.DeportistaDetailDTO;
import com.ipdsystem.sistemaipd.Dto.DeportistaRequestDTO;
import com.ipdsystem.sistemaipd.Dto.DeportistaResponseDTO;
import com.ipdsystem.sistemaipd.Dto.ProgresoDeportistaResponseDTO;
import com.ipdsystem.sistemaipd.Entity.Deportista; // Asegúrate de que esta importación sea correcta
import com.ipdsystem.sistemaipd.Entity.Entrenador; // Importar Entrenador
import com.ipdsystem.sistemaipd.Service.DeportistaService;
import com.ipdsystem.sistemaipd.Service.ProgresoDeportistaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.ipdsystem.sistemaipd.Exception.EntityNotFoundException;

import java.util.List;

@RestController
@RequestMapping("/api/v1/deportistas")
public class DeportistaController {

    @Autowired
    private DeportistaService deportistaService;

    @Autowired
    private ProgresoDeportistaService progresoDeportistaService;

    @GetMapping
    public ResponseEntity<List<DeportistaResponseDTO>> obtenerTodosLosDeportistas() {
        List<DeportistaResponseDTO> deportistas = deportistaService.obtenerTodos();
        return ResponseEntity.ok(deportistas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeportistaDetailDTO> obtenerDeportistaPorId(@PathVariable Long id) {
        return deportistaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DeportistaResponseDTO> crearDeportista(@RequestBody DeportistaRequestDTO deportistaDTO) {
        DeportistaResponseDTO nuevoDeportista = deportistaService.crearDeportista(deportistaDTO);
        return new ResponseEntity<>(nuevoDeportista, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeportistaResponseDTO> actualizarDeportista(@PathVariable Long id, @RequestBody DeportistaRequestDTO deportistaDTO) {
        DeportistaResponseDTO deportistaActualizado = deportistaService.actualizarDeportista(id, deportistaDTO);
        return ResponseEntity.ok(deportistaActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDeportista(@PathVariable Long id) {
        deportistaService.eliminarDeportista(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint para obtener historial de progreso de un deportista
    @GetMapping("/{deportistaId}/progresos")
    public ResponseEntity<List<ProgresoDeportistaResponseDTO>> getHistorialProgreso(
            @PathVariable Long deportistaId,
            @AuthenticationPrincipal UserDetails currentUser) {

        // Log para depuración: Muestra el ID del usuario actual y el ID solicitado
        System.out.println("Solicitud de historial de progreso para deportistaId: " + deportistaId +
                " por usuario: " + currentUser.getUsername() +
                " con rol: " + currentUser.getAuthorities());

        // Comprobar rol de ADMINISTRADOR (puede ver todos)
        if (currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"))) {
            // No se necesita validación adicional para ADMIN
        }
        // Comprobar rol de DEPORTISTA (solo puede ver su propio historial)
        else if (currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_DEPORTISTA"))) {
            if (currentUser instanceof Deportista) {
                Deportista authDeportista = (Deportista) currentUser;
                if (!authDeportista.getId().equals(deportistaId)) {
                    System.out.println("DENIED: Deportista " + authDeportista.getId() + " intentó ver progreso de " + deportistaId);
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // No es su propio progreso
                }
            } else {
                System.out.println("DENIED: Usuario con rol DEPORTISTA no es instancia de Deportista.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        // Comprobar rol de ENTRENADOR (puede ver los progresos de sus deportistas asignados)
        // La seguridad a nivel de controlador ya permite a los entrenadores acceder,
        // pero una validación más granular (solo a sus deportistas asignados) debería ir aquí
        // o preferiblemente en el ProgresoDeportistaService.
        // Por ahora, si SecurityConfig ya permite al entrenador, asumimos que puede.
        else if (currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ENTRENADOR"))) {
            // Si el entrenador solo debe ver a "sus" deportistas, aquí deberías añadir:
            // Entrenador entrenadorActual = (Entrenador) currentUser;
            // if (!progresoDeportistaService.isDeportistaAssignedToEntrenador(deportistaId, entrenadorActual.getId())) {
            //    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            // }
            System.out.println("ALLOWED: Entrenador viendo progreso de " + deportistaId);
        }
        // Si el rol no es ninguno de los anteriores (ej. si SecurityConfig falló o un rol inesperado)
        else {
            System.out.println("DENIED: Rol no autorizado para ver progresos: " + currentUser.getAuthorities());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            List<ProgresoDeportistaResponseDTO> progresos = progresoDeportistaService.getProgresosByDeportistaId(deportistaId);
            return ResponseEntity.ok(progresos);
        } catch (EntityNotFoundException e) {
            System.out.println("Deportista no encontrado para progreso: " + deportistaId);
            return ResponseEntity.notFound().build();
        }
    }
}