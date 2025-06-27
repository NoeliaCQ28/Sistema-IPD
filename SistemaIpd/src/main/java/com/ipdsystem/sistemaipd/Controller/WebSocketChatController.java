package com.ipdsystem.sistemaipd.Controller;

import com.ipdsystem.sistemaipd.Dto.MensajeRequestDTO;
import com.ipdsystem.sistemaipd.Dto.MensajeResponseDTO;
import com.ipdsystem.sistemaipd.Service.MensajeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class WebSocketChatController {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketChatController.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MensajeService mensajeService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload MensajeRequestDTO chatMessage, Principal principal) {

        if (principal == null) {
            logger.error("Intento de envío de mensaje por un usuario no autenticado.");
            return;
        }

        logger.info("Recibido mensaje de {}: '{}'", chatMessage.getRemitenteId(), chatMessage.getContenido());

        try {
            // 1. Guardar mensaje y obtener la respuesta completa
            MensajeResponseDTO savedMessage = mensajeService.enviarMensaje(chatMessage);
            logger.info("Mensaje guardado con ID: {}. Preparando para enviar a los clientes.", savedMessage.getId());

            // 2. Enviar el mensaje de vuelta al remitente
            messagingTemplate.convertAndSendToUser(
                    savedMessage.getRemitenteId().toString(),
                    "/queue/messages",
                    savedMessage
            );
            logger.info("Enviado mensaje a la cola del remitente: {}", savedMessage.getRemitenteId());

            // 3. Enviar el mensaje al receptor
            messagingTemplate.convertAndSendToUser(
                    savedMessage.getReceptorId().toString(),
                    "/queue/messages",
                    savedMessage
            );
            logger.info("Enviado mensaje a la cola del receptor: {}", savedMessage.getReceptorId());

        } catch (Exception e) {
            // Este log es crucial para ver cualquier error que ocurra durante el proceso
            logger.error("Error al procesar o enviar mensaje WebSocket", e);
        }
    }
}
