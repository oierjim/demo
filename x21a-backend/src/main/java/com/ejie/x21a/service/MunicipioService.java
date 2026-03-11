package com.ejie.x21a.service;

import com.ejie.x21a.model.Municipio;
import com.ejie.x21a.repository.MunicipioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MunicipioService {
    @Autowired
    private MunicipioRepository municipioRepository;

    public List<Municipio> findAll() {
        return municipioRepository.findAll();
    }

    public List<Municipio> findByProvinciaId(String provinciaId) {
        return municipioRepository.findByProvinciaId(provinciaId);
    }
    
    public void saveAll(List<Municipio> municipios) {
        municipioRepository.saveAll(municipios);
    }
}
