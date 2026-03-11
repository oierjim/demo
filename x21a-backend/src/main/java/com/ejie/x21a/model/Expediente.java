package com.ejie.x21a.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "EXPEDIENTES")
public class Expediente {
    @Id
    @Column(name = "REFERENCIA")
    private String referencia; // Esta es la PK real
    
    private String solicitante;
    private Date fechaApertura;
    private String estado;
    private Date fechaCierre;
    private String ultimoTramite;

    @ManyToOne
    @JoinColumn(name = "PROVINCIA_ID", referencedColumnName = "ID")
    private Provincia provincia;

    @ManyToOne
    @JoinColumn(name = "MUNICIPIO_ID", referencedColumnName = "ID")
    private Municipio municipio;

    // Métodos de compatibilidad para el genérico
    public String getId() { return referencia; }
    public void setId(String id) { this.referencia = id; }

    // Getters y Setters estándar
    public String getReferencia() { return referencia; }
    public void setReferencia(String referencia) { this.referencia = referencia; }
    public String getSolicitante() { return solicitante; }
    public void setSolicitante(String solicitante) { this.solicitante = solicitante; }
    public Date getFechaApertura() { return fechaApertura; }
    public void setFechaApertura(Date fechaApertura) { this.fechaApertura = fechaApertura; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public Date getFechaCierre() { return fechaCierre; }
    public void setFechaCierre(Date fechaCierre) { this.fechaCierre = fechaCierre; }
    public String getUltimoTramite() { return ultimoTramite; }
    public void setUltimoTramite(String ultimoTramite) { this.ultimoTramite = ultimoTramite; }

    public Provincia getProvincia() { return provincia; }
    public void setProvincia(Provincia provincia) { this.provincia = provincia; }
    public Municipio getMunicipio() { return municipio; }
    public void setMunicipio(Municipio municipio) { this.municipio = municipio; }
}