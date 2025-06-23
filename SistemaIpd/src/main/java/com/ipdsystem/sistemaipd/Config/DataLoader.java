package com.ipdsystem.sistemaipd.Config;

import com.ipdsystem.sistemaipd.Entity.Evento; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import com.ipdsystem.sistemaipd.Repository.EventoRepository; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(EventoRepository eventoRepository) {
        return args -> {
            // Solo poblar si no hay eventos existentes
            if (eventoRepository.count() == 0) {
                System.out.println("Poblando base de datos con datos de ejemplo...");

                // Datos de ejemplo para eventos
                Evento evento1 = new Evento(
                        null, // ID nulo para que la base de datos lo genere
                        "Reunión General de Entrenadores",
                        LocalDateTime.of(2025, 6, 16, 10, 0),
                        LocalDateTime.of(2025, 6, 16, 12, 0),
                        "General"
                );

                Evento evento2 = new Evento(
                        null, // ID nulo
                        "Clasificatorio Regional de Atletismo",
                        LocalDateTime.of(2025, 7, 5, 9, 0),
                        LocalDateTime.of(2025, 7, 6, 17, 0),
                        "Atletismo"
                );

                Evento evento3 = new Evento(
                        null, // ID nulo
                        "Taller de Nutrición Deportiva",
                        LocalDateTime.of(2025, 8, 10, 14, 0),
                        LocalDateTime.of(2025, 8, 10, 17, 0),
                        "Nutrición"
                );

                Evento evento4 = new Evento(
                        null, // ID nulo
                        "Carrera 6 km",
                        LocalDateTime.of(2025, 6, 13, 1, 0),
                        LocalDateTime.of(2025, 6, 14, 1, 0),
                        "Atletismo"
                );

                Evento evento5 = new Evento(
                        null, // ID nulo
                        "Carrera 5 km",
                        LocalDateTime.of(2025, 8, 14, 1, 0),
                        LocalDateTime.of(2025, 8, 15, 1, 0),
                        "Atletismo"
                );

                eventoRepository.save(evento1);
                eventoRepository.save(evento2);
                eventoRepository.save(evento3);
                eventoRepository.save(evento4);
                eventoRepository.save(evento5);

                System.out.println("Datos de ejemplo de Eventos cargados.");
            }
        };
    }
}