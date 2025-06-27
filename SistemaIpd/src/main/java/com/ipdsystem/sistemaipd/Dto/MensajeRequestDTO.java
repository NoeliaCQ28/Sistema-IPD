package com.ipdsystem.sistemaipd.Dto;

public class MensajeRequestDTO {
    private Long remitenteId;
    private String remitenteRol;
    private Long receptorId;
    private String receptorRol;
    private String contenido;

    // --- GETTERS (necesarios para que el servicio lea los datos) ---
    public Long getRemitenteId() { return remitenteId; }
    public String getRemitenteRol() { return remitenteRol; }
    public Long getReceptorId() { return receptorId; }
    public String getReceptorRol() { return receptorRol; }
    public String getContenido() { return contenido; }

    // --- SETTERS (CRUCIALES para que Spring pueda crear el objeto desde el JSON) ---
    public void setRemitenteId(Long remitenteId) { this.remitenteId = remitenteId; }
    public void setRemitenteRol(String remitenteRol) { this.remitenteRol = remitenteRol; }
    public void setReceptorId(Long receptorId) { this.receptorId = receptorId; }
    public void setReceptorRol(String receptorRol) { this.receptorRol = receptorRol; }
    public void setContenido(String contenido) { this.contenido = contenido; }
}
