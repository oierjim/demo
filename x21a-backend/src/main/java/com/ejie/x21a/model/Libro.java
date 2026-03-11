package com.ejie.x21a.model;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "LIBROS")
public class Libro {

    @Id
    @Column(name = "ISBN")
    private String isbn;

    @Column(name = "TITULO", nullable = false)
    private String titulo;

    @Column(name = "AUTOR", nullable = false)
    private String autor;

    @Column(name = "ESTRELLAS")
    private Integer estrellas;

    @Temporal(TemporalType.DATE)
    @Column(name = "FECHA_PUBLICACION")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private Date fechaPublicacion;

    // Métodos de compatibilidad para el ID genérico (Frontend/BaseController)
    public String getId() {
        return isbn;
    }

    public void setId(String id) {
        this.isbn = id;
    }

    // Getters y Setters estándar
    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public Integer getEstrellas() {
        return estrellas;
    }

    public void setEstrellas(Integer estrellas) {
        this.estrellas = estrellas;
    }

    public Date getFechaPublicacion() {
        return fechaPublicacion;
    }

    public void setFechaPublicacion(Date fechaPublicacion) {
        this.fechaPublicacion = fechaPublicacion;
    }
}
