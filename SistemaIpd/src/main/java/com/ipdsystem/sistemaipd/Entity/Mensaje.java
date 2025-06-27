package com.ipdsystem.sistemaipd.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensajes")
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

    @Column(nullable = false)
    private Long remitenteId;

    @Column(nullable = false, length = 50)
    private String remitenteRol;

    @Column(nullable = false)
    private Long receptorId;

    @Column(nullable = false, length = 50)
    private String receptorRol;

    @PrePersist
    protected void onCreate() {
        fechaEnvio = LocalDateTime.now();
    }

    // --- Getters y Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }
    public LocalDateTime getFechaEnvio() { return fechaEnvio; }
    public void setFechaEnvio(LocalDateTime fechaEnvio) { this.fechaEnvio = fechaEnvio; }
    public boolean isLeido() { return leido; }
    public void setLeido(boolean leido) { this.leido = leido; }
    public Long getRemitenteId() { return remitenteId; }
    public void setRemitenteId(Long remitenteId) { this.remitenteId = remitenteId; }
    public String getRemitenteRol() { return remitenteRol; }
    public void setRemitenteRol(String remitenteRol) { this.remitenteRol = remitenteRol; }
    public Long getReceptorId() { return receptorId; }
    public void setReceptorId(Long receptorId) { this.receptorId = receptorId; }
    public String getReceptorRol() { return receptorRol; }
    public void setReceptorRol(String receptorRol) { this.receptorRol = receptorRol; }
}
