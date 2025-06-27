package com.ipdsystem.sistemaipd.Dto;

import java.time.LocalDateTime;

public class MensajeResponseDTO {
    private Long id;
    private String contenido;
    private LocalDateTime fechaEnvio;
    private boolean leido;
    private Long remitenteId;
    private String remitenteRol;
    private String remitenteNombre;
    private Long receptorId;
    private String receptorRol;
    private String receptorNombre;

    // --- GETTERS Y SETTERS MANUALES ---
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
    public String getRemitenteNombre() { return remitenteNombre; }
    public void setRemitenteNombre(String remitenteNombre) { this.remitenteNombre = remitenteNombre; }
    public Long getReceptorId() { return receptorId; }
    public void setReceptorId(Long receptorId) { this.receptorId = receptorId; }
    public String getReceptorRol() { return receptorRol; }
    public void setReceptorRol(String receptorRol) { this.receptorRol = receptorRol; }
    public String getReceptorNombre() { return receptorNombre; }
    public void setReceptorNombre(String receptorNombre) { this.receptorNombre = receptorNombre; }
}
