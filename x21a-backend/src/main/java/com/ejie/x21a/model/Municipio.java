package com.ejie.x21a.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "MUNICIPIOS")
public class Municipio {
    @Id
    @Column(name = "ID")
    private String id;
    
    @Column(name = "PROVINCIA_ID")
    private String provinciaId;
    
    @Column(name = "DESCRIPCIONC")
    private String descripcionC;
    
    @Column(name = "DESCRIPCIONE")
    private String descripcionE;

    public Municipio() {}

    public Municipio(String id, String provinciaId, String descripcionC, String descripcionE) {
        this.id = id;
        this.provinciaId = provinciaId;
        this.descripcionC = descripcionC;
        this.descripcionE = descripcionE;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getProvinciaId() { return provinciaId; }
    public void setProvinciaId(String provinciaId) { this.provinciaId = provinciaId; }
    public String getDescripcionC() { return descripcionC; }
    public void setDescripcionC(String descripcionC) { this.descripcionC = descripcionC; }
    public String getDescripcionE() { return descripcionE; }
    public void setDescripcionE(String descripcionE) { this.descripcionE = descripcionE; }
}
