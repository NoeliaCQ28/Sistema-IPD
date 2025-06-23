package com.ipdsystem.sistemaipd.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // Habilita el manejo de mensajes WebSocket con un broker de mensajes STOMP.
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Habilita un broker de mensajes simple, que maneja mensajes basados en prefijos.
        // Los clientes se suscribirán a destinos con el prefijo "/topic" para recibir mensajes.
        config.enableSimpleBroker("/topic");
        // Establece el prefijo para destinos dirigidos a métodos manejadores de mensajes.
        // Por ejemplo, los mensajes enviados a "/app/chat" serán ruteados al método @MessageMapping.
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Registra un endpoint WebSocket al que los clientes se conectarán.
        // La URL de conexión será ws://localhost:8081/ws
        // .withSockJS() habilita SockJS para clientes que no soportan WebSockets nativos (fallback).
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("http://localhost:3000") // Permitir conexiones desde tu frontend React
                .withSockJS();
    }
}