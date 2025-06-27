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

import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/mensajes")
public class MensajeController {

    @Autowired
    private MensajeService mensajeService;

    @PostMapping("/enviar")
    public ResponseEntity<MensajeResponseDTO> enviarMensaje(@RequestBody MensajeRequestDTO requestDTO, @AuthenticationPrincipal UserDetails currentUser) {

        Long currentUserId = -1L;

        try {
            Method getIdMethod = currentUser.getClass().getMethod("getId");
            currentUserId = (Long) getIdMethod.invoke(currentUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        if (!currentUserId.equals(requestDTO.getRemitenteId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            MensajeResponseDTO responseDTO = mensajeService.enviarMensaje(requestDTO);
            return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/conversacion/{otroUsuarioId}/{otroUsuarioRol}")
    public ResponseEntity<List<MensajeResponseDTO>> getConversation(
            @PathVariable Long otroUsuarioId,
            @PathVariable String otroUsuarioRol,
            @AuthenticationPrincipal UserDetails currentUser) {

        Long currentUserId = -1L;
        String currentUserRol = "";

        if (currentUser instanceof Deportista) {
            currentUserId = ((Deportista) currentUser).getId();
            currentUserRol = "DEPORTISTA";
        } else if (currentUser instanceof Entrenador) {
            currentUserId = ((Entrenador) currentUser).getId();
            currentUserRol = "ENTRENADOR";
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<MensajeResponseDTO> conversation = mensajeService.getConversation(currentUserId, currentUserRol, otroUsuarioId, otroUsuarioRol);
        return ResponseEntity.ok(conversation);
    }

    @PutMapping("/{mensajeId}/leido")
    public ResponseEntity<MensajeResponseDTO> marcarMensajeComoLeido(@PathVariable Long mensajeId) {
        try {
            MensajeResponseDTO updatedMensaje = mensajeService.marcarComoLeido(mensajeId);
            return ResponseEntity.ok(updatedMensaje);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/no-leidos/conteo")
    public ResponseEntity<Long> getUnreadMessagesCount(@AuthenticationPrincipal UserDetails currentUser) {
        Long currentUserId = -1L;
        String currentUserRol = "";

        if (currentUser instanceof Deportista) {
            currentUserId = ((Deportista) currentUser).getId();
            currentUserRol = "DEPORTISTA";
        } else if (currentUser instanceof Entrenador) {
            currentUserId = ((Entrenador) currentUser).getId();
            currentUserRol = "ENTRENADOR";
        } else {
            return ResponseEntity.ok(0L);
        }

        // --- LÍNEA CORREGIDA ---
        // Se pasan los dos argumentos que el método espera
        long count = mensajeService.countUnreadMessagesForUser(currentUserId, currentUserRol);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/no-leidos/por-remitente")
    public ResponseEntity<Map<Long, Long>> getUnreadMessagesCountBySender(@AuthenticationPrincipal UserDetails currentUser) {
        Long currentUserId = -1L;
        String currentUserRol = "";

        if (currentUser instanceof Deportista) {
            currentUserId = ((Deportista) currentUser).getId();
            currentUserRol = "DEPORTISTA";
        } else if (currentUser instanceof Entrenador) {
            currentUserId = ((Entrenador) currentUser).getId();
            currentUserRol = "ENTRENADOR";
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Map<Long, Long> counts = mensajeService.getUnreadMessageCountBySender(currentUserId, currentUserRol);
        return ResponseEntity.ok(counts);
    }
}
