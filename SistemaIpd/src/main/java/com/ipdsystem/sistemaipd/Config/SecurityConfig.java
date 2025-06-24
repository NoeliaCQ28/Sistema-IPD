package com.ipdsystem.sistemaipd.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                        // Permite acceder al endpoint de perfil propio para cualquier usuario autenticado.
                        .requestMatchers("/api/v1/auth/me", "/api/v1/profile/**").authenticated()

                        // Permite ver eventos a todos los autenticados.
                        .requestMatchers(HttpMethod.GET, "/api/v1/eventos/**").authenticated()
                        // Admin puede crear/editar/eliminar eventos.
                        .requestMatchers(HttpMethod.POST, "/api/v1/eventos/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/eventos/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/eventos/**").hasRole("ADMINISTRADOR")

                        // REGLAS PARA DEPORTISTAS:
                        .requestMatchers(HttpMethod.GET, "/api/v1/deportistas/{id}").hasAnyRole("DEPORTISTA", "ADMINISTRADOR", "ENTRENADOR")
                        .requestMatchers(HttpMethod.GET, "/api/v1/deportistas/{deportistaId}/progresos").hasAnyRole("DEPORTISTA", "ADMINISTRADOR", "ENTRENADOR")
                        .requestMatchers("/api/v1/deportistas/**").hasRole("ADMINISTRADOR")

                        // REGLAS PARA ENTRENADORES:
                        .requestMatchers(HttpMethod.GET, "/api/v1/entrenadores/{id}").hasAnyRole("ENTRENADOR", "ADMINISTRADOR")
                        .requestMatchers(HttpMethod.GET, "/api/v1/entrenadores/{id}/deportistas").hasAnyRole("ENTRENADOR", "ADMINISTRADOR")
                        .requestMatchers(HttpMethod.POST, "/api/v1/entrenadores/{entrenadorId}/horarios-asignar").hasAnyRole("ENTRENADOR", "ADMINISTRADOR")
                        .requestMatchers(HttpMethod.POST, "/api/v1/entrenadores/{entrenadorId}/progresos").hasAnyRole("ENTRENADOR", "ADMINISTRADOR")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/entrenadores/{entrenadorId}/progresos/{progresoId}").hasAnyRole("ENTRENADOR", "ADMINISTRADOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/entrenadores/{entrenadorId}/progresos/{progresoId}").hasAnyRole("ENTRENADOR", "ADMINISTRADOR")

                        // --- REGLAS PARA MENSAJERÍA REST ---
                        .requestMatchers(HttpMethod.POST, "/api/v1/mensajes/enviar").hasAnyRole("DEPORTISTA", "ENTRENADOR")
                        .requestMatchers(HttpMethod.GET, "/api/v1/mensajes/conversacion/{otroUsuarioId}/{otroUsuarioRol}").hasAnyRole("DEPORTISTA", "ENTRENADOR")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/mensajes/{mensajeId}/leido").hasAnyRole("DEPORTISTA", "ENTRENADOR")
                        .requestMatchers(HttpMethod.GET, "/api/v1/mensajes/no-leidos/conteo").hasAnyRole("DEPORTISTA", "ENTRENADOR")
                        // --- LÍNEA AÑADIDA ---
                        .requestMatchers(HttpMethod.GET, "/api/v1/mensajes/no-leidos/por-remitente").hasAnyRole("DEPORTISTA", "ENTRENADOR")
                        // --- FIN DE LA LÍNEA AÑADIDA ---
                        // Admin también puede acceder a todos los endpoints REST de mensajes
                        .requestMatchers("/api/v1/mensajes/**").hasRole("ADMINISTRADOR")

                        // --- REGLAS PARA WEBSOCKETS ---
                        .requestMatchers("/ws/**").authenticated()

                        // REGLAS GENERALES para administradores
                        .requestMatchers("/api/v1/administradores/**").hasRole("ADMINISTRADOR")
                        .anyRequest().hasRole("ADMINISTRADOR")
                )
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}