package com.ipdsystem.sistemaipd.Entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "mensajes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Mensaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String contenido;

    @Column(nullable = false)
    private LocalDateTime fechaEnvio;

    @Column(nullable = false)
    private boolean leido = false;

    // Campos para identificar al remitente (ID y Rol)
    @Column(nullable = false)
    private Long remitenteId;
    @Column(nullable = false, length = 50)
    private String remitenteRol; // Ej: "DEPORTISTA", "ENTRENADOR", "ADMINISTRADOR"

    // Campos para identificar al receptor (ID y Rol)
    @Column(nullable = false)
    private Long receptorId;
    @Column(nullable = false, length = 50)
    private String receptorRol; // Ej: "DEPORTISTA", "ENTRENADOR", "ADMINISTRADOR"

    @PrePersist
    protected void onCreate() {
        fechaEnvio = LocalDateTime.now();
    }
}