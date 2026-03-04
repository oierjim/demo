package com.ejie.x21a.model.filter;

import java.util.Date;

public class AnimalFilter {
    private String nombre;
    private String raza;
    private Date fechaNacimientoDesde;
    private Date fechaNacimientoHasta;
    private Double pesoDesde;
    private Double pesoHasta;

    // Getters y Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getRaza() { return raza; }
    public void setRaza(String raza) { this.raza = raza; }
    public Date getFechaNacimientoDesde() { return fechaNacimientoDesde; }
    public void setFechaNacimientoDesde(Date fechaNacimientoDesde) { this.fechaNacimientoDesde = fechaNacimientoDesde; }
    public Date getFechaNacimientoHasta() { return fechaNacimientoHasta; }
    public void setFechaNacimientoHasta(Date fechaNacimientoHasta) { this.fechaNacimientoHasta = fechaNacimientoHasta; }
    public Double getPesoDesde() { return pesoDesde; }
    public void setPesoDesde(Double pesoDesde) { this.pesoDesde = pesoDesde; }
    public Double getPesoHasta() { return pesoHasta; }
    public void setPesoHasta(Double pesoHasta) { this.pesoHasta = pesoHasta; }
}