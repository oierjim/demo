package com.ejie.x21a.model.filter;

import java.time.LocalDate;

public class SerieFilter {
    private String titulo;
    private String tipo;
    private String plataforma;
    private LocalDate fechaEstrenoDesde;
    private LocalDate fechaEstrenoHasta;

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getPlataforma() { return plataforma; }
    public void setPlataforma(String plataforma) { this.plataforma = plataforma; }
    public LocalDate getFechaEstrenoDesde() { return fechaEstrenoDesde; }
    public void setFechaEstrenoDesde(LocalDate fechaEstrenoDesde) { this.fechaEstrenoDesde = fechaEstrenoDesde; }
    public LocalDate getFechaEstrenoHasta() { return fechaEstrenoHasta; }
    public void setFechaEstrenoHasta(LocalDate fechaEstrenoHasta) { this.fechaEstrenoHasta = fechaEstrenoHasta; }
}