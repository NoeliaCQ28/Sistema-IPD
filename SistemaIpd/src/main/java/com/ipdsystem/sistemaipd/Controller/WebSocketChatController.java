package com.ipdsystem.sistemaipd.Controller;

import com.ipdsystem.sistemaipd.Dto.MensajeRequestDTO;
import com.ipdsystem.sistemaipd.Dto.MensajeResponseDTO;
import com.ipdsystem.sistemaipd.Service.MensajeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import java.security.Principal;

@Controller
public class WebSocketChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MensajeService mensajeService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload MensajeRequestDTO chatMessage, Principal principal) {
        // Guardar el mensaje y obtenerlo con todos los datos (ID, fecha, etc.)
        MensajeResponseDTO savedMessage = mensajeService.enviarMensaje(chatMessage);

        // **PUNTO CLAVE Y OBLIGATORIO**
        // Enviar el mensaje a la cola personal del RECEPTOR.
        // Spring convierte esto en un envío a "/user/{ID}/queue/messages".
        messagingTemplate.convertAndSendToUser(
                savedMessage.getReceptorId().toString(),
                "/queue/messages",
                savedMessage
        );

        // **PUNTO CLAVE Y OBLIGATORIO**
        // Enviar el mensaje de vuelta al REMITENTE.
        // Esto confirma que el mensaje se procesó y sincroniza todos los clientes del remitente.
        messagingTemplate.convertAndSendToUser(
                savedMessage.getRemitenteId().toString(),
                "/queue/messages",
                savedMessage
        );
    }
}