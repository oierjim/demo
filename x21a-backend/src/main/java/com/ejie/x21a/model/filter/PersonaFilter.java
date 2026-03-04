package com.ejie.x21a.model.filter;

import java.util.Date;

public class PersonaFilter {
    private String dni;
    private String nombre;
    private String apellido1;
    private String email;
    private Date fechaNacimientoDesde;
    private Date fechaNacimientoHasta;

    // Getters y Setters
    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getApellido1() { return apellido1; }
    public void setApellido1(String apellido1) { this.apellido1 = apellido1; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Date getFechaNacimientoDesde() { return fechaNacimientoDesde; }
    public void setFechaNacimientoDesde(Date fechaNacimientoDesde) { this.fechaNacimientoDesde = fechaNacimientoDesde; }
    public Date getFechaNacimientoHasta() { return fechaNacimientoHasta; }
    public void setFechaNacimientoHasta(Date fechaNacimientoHasta) { this.fechaNacimientoHasta = fechaNacimientoHasta; }
}