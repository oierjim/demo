package com.ejie.x21a.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "PROVINCIAS")
public class Provincia {
    @Id
    @Column(name = "ID")
    private String id;
    
    @Column(name = "DESCRIPCIONC")
    private String descripcionC;
    
    @Column(name = "DESCRIPCIONE")
    private String descripcionE;

    public Provincia() {}

    public Provincia(String id, String descripcionC, String descripcionE) {
        this.id = id;
        this.descripcionC = descripcionC;
        this.descripcionE = descripcionE;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getDescripcionC() { return descripcionC; }
    public void setDescripcionC(String descripcionC) { this.descripcionC = descripcionC; }
    public String getDescripcionE() { return descripcionE; }
    public void setDescripcionE(String descripcionE) { this.descripcionE = descripcionE; }
}
