package com.ejie.x21a.model;

import org.springframework.context.i18n.LocaleContextHolder;

public class ComboElemento {
    private String id;
    private String descripcionC;
    private String descripcionE;

    public ComboElemento() {}

    public ComboElemento(String id, String descripcionC, String descripcionE) {
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

    public String getLabel() {
        String lang = LocaleContextHolder.getLocale().getLanguage();
        return "eu".equalsIgnoreCase(lang) ? descripcionE : descripcionC;
    }
}
