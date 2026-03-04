package com.ejie.x21a.model.filter;

import java.util.Date;

public class ExpedienteFilter {
    private String referencia;
    private String solicitante;
    private String estado;
    private Date fechaAperturaDesde;
    private Date fechaAperturaHasta;

    // Getters y Setters
    public String getReferencia() { return referencia; }
    public void setReferencia(String referencia) { this.referencia = referencia; }
    public String getSolicitante() { return solicitante; }
    public void setSolicitante(String solicitante) { this.solicitante = solicitante; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public Date getFechaAperturaDesde() { return fechaAperturaDesde; }
    public void setFechaAperturaDesde(Date fechaAperturaDesde) { this.fechaAperturaDesde = fechaAperturaDesde; }
    public Date getFechaAperturaHasta() { return fechaAperturaHasta; }
    public void setFechaAperturaHasta(Date fechaAperturaHasta) { this.fechaAperturaHasta = fechaAperturaHasta; }
}