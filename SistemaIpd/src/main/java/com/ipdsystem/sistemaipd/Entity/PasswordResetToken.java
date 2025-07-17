package com.ipdsystem.sistemaipd.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class PasswordResetToken {

    private static final int EXPIRATION_MINUTES = 60; // El token ahora expira en 1 hora

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    // Solo uno de estos campos tendrá un valor, los otros serán nulos.
    @ManyToOne(targetEntity = Administrador.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "administrador_id")
    private Administrador administrador;

    @ManyToOne(targetEntity = Entrenador.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "entrenador_id")
    private Entrenador entrenador;

    @ManyToOne(targetEntity = Deportista.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "deportista_id")
    private Deportista deportista;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    /**
     * Calcula la fecha de expiración al crear el token.
     */
    private void setExpiryDate() {
        this.expiryDate = LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES);
    }

    /**
     * Constructor para un Administrador.
     */
    public PasswordResetToken(String token, Administrador admin) {
        this.token = token;
        this.administrador = admin;
        setExpiryDate();
    }

    /**
     * Constructor para un Entrenador.
     */
    public PasswordResetToken(String token, Entrenador entrenador) {
        this.token = token;
        this.entrenador = entrenador;
        setExpiryDate();
    }

    /**
     * Constructor para un Deportista.
     */
    public PasswordResetToken(String token, Deportista deportista) {
        this.token = token;
        this.deportista = deportista;
        setExpiryDate();
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }
}