package com.ipdsystem.sistemaipd.Config;

import com.ipdsystem.sistemaipd.Service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            List<String> authorizationHeaders = accessor.getNativeHeader("Authorization");

            if (authorizationHeaders != null && !authorizationHeaders.isEmpty()) {
                String authHeader = authorizationHeaders.get(0);

                if (authHeader != null && authHeader.startsWith("Basic ")) {
                    try {
                        String base64Credentials = authHeader.substring("Basic ".length()).trim();
                        byte[] credDecoded = Base64.getDecoder().decode(base64Credentials);
                        String credentials = new String(credDecoded, StandardCharsets.UTF_8);
                        final String[] values = credentials.split(":", 2);
                        String username = values[0];
                        String password = values[1];

                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                        if (userDetails != null && passwordEncoder.matches(password, userDetails.getPassword())) {
                            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
                            accessor.setUser(authentication);
                        }
                    } catch (Exception e) {
                        System.err.println("Error de autenticación en WebSocket durante el CONNECT: " + e.getMessage());
                    }
                }
            }
        }
        return message;
    }
}
