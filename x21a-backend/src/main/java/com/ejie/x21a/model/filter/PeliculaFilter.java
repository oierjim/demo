package com.ejie.x21a.model.filter;

import java.util.Date;

public class PeliculaFilter {
    private String titulo;
    private String genero;
    private Date fechaEstrenoDesde;
    private Date fechaEstrenoHasta;

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }
    public Date getFechaEstrenoDesde() { return fechaEstrenoDesde; }
    public void setFechaEstrenoDesde(Date fechaEstrenoDesde) { this.fechaEstrenoDesde = fechaEstrenoDesde; }
    public Date getFechaEstrenoHasta() { return fechaEstrenoHasta; }
    public void setFechaEstrenoHasta(Date fechaEstrenoHasta) { this.fechaEstrenoHasta = fechaEstrenoHasta; }
}
