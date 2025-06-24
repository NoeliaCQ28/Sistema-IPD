package com.ipdsystem.sistemaipd.Controller;

import com.ipdsystem.sistemaipd.Dto.MensajeRequestDTO;
import com.ipdsystem.sistemaipd.Dto.MensajeResponseDTO;
import com.ipdsystem.sistemaipd.Entity.Deportista;
import com.ipdsystem.sistemaipd.Entity.Entrenador;
import com.ipdsystem.sistemaipd.Service.MensajeService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map; // <-- IMPORTACIÓN NUEVA

@RestController
@RequestMapping("/api/v1/mensajes")
public class MensajeController {

    @Autowired
    private MensajeService mensajeService;

    @PostMapping("/enviar")
    public ResponseEntity<MensajeResponseDTO> enviarMensaje(@RequestBody MensajeRequestDTO requestDTO, @AuthenticationPrincipal UserDetails currentUser) {
        // Validar que el remitenteId y remitenteRol del DTO coincidan con el usuario autenticado
        Long authUserId = null;
        String authUserRol = null;

        if (currentUser instanceof Deportista) {
            authUserId = ((Deportista) currentUser).getId();
            authUserRol = "DEPORTISTA";
        } else if (currentUser instanceof Entrenador) {
            authUserId = ((Entrenador) currentUser).getId();
            authUserRol = "ENTRENADOR";
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Solo deportistas/entrenadores pueden enviar
        }

        if (!authUserId.equals(requestDTO.getRemitenteId()) || !authUserRol.equals(requestDTO.getRemitenteRol())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // No puede enviar mensajes en nombre de otro
        }

        try {
            MensajeResponseDTO responseDTO = mensajeService.enviarMensaje(requestDTO);
            return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Obtener conversación entre el usuario autenticado y otro usuario (por su ID y Rol)
    @GetMapping("/conversacion/{otroUsuarioId}/{otroUsuarioRol}")
    public ResponseEntity<List<MensajeResponseDTO>> getConversation(
            @PathVariable Long otroUsuarioId,
            @PathVariable String otroUsuarioRol,
            @AuthenticationPrincipal UserDetails currentUser) {

        Long currentUserId = null;
        String currentUserRol = null;

        if (currentUser instanceof Deportista) {
            currentUserId = ((Deportista) currentUser).getId();
            currentUserRol = "DEPORTISTA";
        } else if (currentUser instanceof Entrenador) {
            currentUserId = ((Entrenador) currentUser).getId();
            currentUserRol = "ENTRENADOR";
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        try {
            List<MensajeResponseDTO> conversation = mensajeService.getConversation(currentUserId, currentUserRol, otroUsuarioId, otroUsuarioRol);
            return ResponseEntity.ok(conversation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Marcar un mensaje como leído
    @PutMapping("/{mensajeId}/leido")
    public ResponseEntity<MensajeResponseDTO> marcarMensajeComoLeido(
            @PathVariable Long mensajeId,
            @AuthenticationPrincipal UserDetails currentUser) {

        // Opcional: Validar que el mensaje es para el usuario actual antes de marcarlo como leído
        // Podrías obtener el mensaje del servicio, verificar si currentUser.id y rol coinciden con receptorId/receptorRol
        // y si no, devolver FORBIDDEN.

        try {
            MensajeResponseDTO updatedMensaje = mensajeService.marcarComoLeido(mensajeId);
            return ResponseEntity.ok(updatedMensaje);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Obtener el conteo de mensajes no leídos
    @GetMapping("/no-leidos/conteo")
    public ResponseEntity<Long> getUnreadMessagesCount(@AuthenticationPrincipal UserDetails currentUser) {
        Long currentUserId = null;
        String currentUserRol = null;

        if (currentUser instanceof Deportista) {
            currentUserId = ((Deportista) currentUser).getId();
            currentUserRol = "DEPORTISTA";
        } else if (currentUser instanceof Entrenador) {
            currentUserId = ((Entrenador) currentUser).getId();
            currentUserRol = "ENTRENADOR";
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(0L); // No autorizado o no aplicable
        }

        return ResponseEntity.ok(mensajeService.countUnreadMessages(currentUserId, currentUserRol));
    }


    // --- NUEVO ENDPOINT AÑADIDO ---
    /**
     * Obtiene el conteo de mensajes no leídos agrupados por el ID de cada remitente.
     * @param currentUser El usuario autenticado (inyectado por Spring Security).
     * @return Un mapa donde la clave es el ID del remitente y el valor es el conteo de sus mensajes no leídos.
     */
    @GetMapping("/no-leidos/por-remitente")
    public ResponseEntity<Map<Long, Long>> getUnreadMessagesCountBySender(@AuthenticationPrincipal UserDetails currentUser) {
        Long currentUserId = null;
        String currentUserRol = null;

        if (currentUser instanceof Deportista) {
            currentUserId = ((Deportista) currentUser).getId();
            currentUserRol = "DEPORTISTA";
        } else if (currentUser instanceof Entrenador) {
            currentUserId = ((Entrenador) currentUser).getId();
            currentUserRol = "ENTRENADOR";
        } else {
            // Si el rol no es deportista ni entrenador, devuelve un error de no autorizado.
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        return ResponseEntity.ok(mensajeService.getUnreadMessageCountBySender(currentUserId, currentUserRol));
    }
}