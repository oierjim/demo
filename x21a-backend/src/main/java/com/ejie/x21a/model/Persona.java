package com.ejie.x21a.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "PERSONAS")
public class Persona {
    @Id
    private String dni; // Esta es la PK real

    private String nombre;
    private String apellido1;
    private String apellido2;
    private Date fechaNacimiento;
    private String email;

    // Métodos de compatibilidad para el genérico
    public String getId() { return dni; }
    public void setId(String id) { this.dni = id; }

    // Getters y Setters estándar
    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getApellido1() { return apellido1; }
    public void setApellido1(String apellido1) { this.apellido1 = apellido1; }
    public String getApellido2() { return apellido2; }
    public void setApellido2(String apellido2) { this.apellido2 = apellido2; }
    public Date getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(Date fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}