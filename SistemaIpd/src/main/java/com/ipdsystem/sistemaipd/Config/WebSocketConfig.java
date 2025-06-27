package com.ipdsystem.sistemaipd.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    // Inyectamos nuestro interceptor de seguridad personalizado.
    @Autowired
    private WebSocketAuthInterceptor webSocketAuthInterceptor;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Habilita un broker de mensajes en memoria para los destinos que comiencen con /topic y /queue.
        config.enableSimpleBroker("/topic", "/queue");
        // Define el prefijo para los mensajes que se dirigirán a los métodos @MessageMapping en los controladores.
        config.setApplicationDestinationPrefixes("/app");
        // Define el prefijo para los destinos de usuario único.
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Registra el endpoint /ws que los clientes usarán para conectarse.
        // setAllowedOriginPatterns("*") permite conexiones desde cualquier origen (ideal para desarrollo).
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    // --- PUNTO CLAVE ---
    // Este método registra nuestro interceptor para que se ejecute en los mensajes entrantes.
    // Sin esto, la seguridad del WebSocket no funcionará.
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(webSocketAuthInterceptor);
    }
}
