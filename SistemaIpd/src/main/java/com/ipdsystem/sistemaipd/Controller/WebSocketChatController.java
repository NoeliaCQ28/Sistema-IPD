package com.ipdsystem.sistemaipd.Controller;

import com.ipdsystem.sistemaipd.Dto.MensajeRequestDTO;
import com.ipdsystem.sistemaipd.Dto.MensajeResponseDTO;
import com.ipdsystem.sistemaipd.Entity.Deportista; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import com.ipdsystem.sistemaipd.Entity.Entrenador; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import com.ipdsystem.sistemaipd.Service.MensajeService;
import jakarta.persistence.EntityNotFoundException; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN! (para @RequestBody si es necesario, aunque @MessageMapping es más común con @Payload)
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import org.springframework.security.core.userdetails.UserDetails; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import org.springframework.stereotype.Controller;
// No necesitas @RequestBody aquí para @MessageMapping, se usa @Payload para el cuerpo del mensaje STOMP
// import org.springframework.web.bind.annotation.RequestBody;


@Controller // Usar @Controller para controladores de WebSocket
public class WebSocketChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MensajeService mensajeService;

    // @MessageMapping maneja los mensajes que llegan con el prefijo /app
    // Por ejemplo, un mensaje enviado a /app/chat.sendMessage
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload MensajeRequestDTO messageRequest, @AuthenticationPrincipal UserDetails currentUser) {
        // Validar que el remitente del mensaje coincide con el usuario autenticado
        Long authUserId = null;
        String authUserRol = null;

        if (currentUser instanceof Deportista) {
            authUserId = ((Deportista) currentUser).getId();
            authUserRol = "DEPORTISTA";
        } else if (currentUser instanceof Entrenador) {
            authUserId = ((Entrenador) currentUser).getId();
            authUserRol = "ENTRENADOR";
        }
        // Si el usuario autenticado no es ni Deportista ni Entrenador, o ID/Rol no coinciden
        if (authUserId == null || !authUserId.equals(messageRequest.getRemitenteId()) || !authUserRol.equals(messageRequest.getRemitenteRol())) {
            System.err.println("Intento de envío de mensaje no autorizado por usuario: " + currentUser.getUsername() +
                    " (Remitente ID en request: " + messageRequest.getRemitenteId() + ", Rol: " + messageRequest.getRemitenteRol() + ")");
            return;
        }

        try {
            MensajeResponseDTO savedMessage = mensajeService.enviarMensaje(messageRequest);

            // Enviar el mensaje al remitente (para que vea su mensaje en el chat)
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(savedMessage.getRemitenteId()), // ID del usuario remitente
                    "/queue/messages", // Prefijo para mensajes privados a un usuario
                    savedMessage
            );

            // Enviar el mensaje al receptor
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(savedMessage.getReceptorId()), // ID del usuario receptor
                    "/queue/messages", // Prefijo para mensajes privados a un usuario
                    savedMessage
            );

            // Considera enviar una señal al receptor para actualizar el conteo de no leídos
            // Esto podría ser a otro tópico, ej: /topic/unread-count/{receptorId}

        } catch (Exception e) {
            System.err.println("Error al procesar mensaje WebSocket: " + e.getMessage());
            e.printStackTrace(); // Mantener para depuración, pero usar logger en producción
        }
    }

    @MessageMapping("/chat.markAsRead")
    public void markAsRead(@Payload Long messageId, @AuthenticationPrincipal UserDetails currentUser) {
        try {
            // Opcional: Validar que el mensaje es realmente para el usuario actual antes de marcarlo como leído
            // Podrías obtener el mensaje, verificar su receptorId y receptorRol.
            MensajeResponseDTO updatedMessage = mensajeService.marcarComoLeido(messageId);
            System.out.println("Mensaje " + messageId + " marcado como leído por " + currentUser.getUsername());
        } catch (EntityNotFoundException e) {
            System.err.println("Mensaje no encontrado para marcar como leído: " + messageId);
        } catch (Exception e) {
            System.err.println("Error al marcar mensaje como leído via WebSocket: " + e.getMessage());
            e.printStackTrace();
        }
    }
}