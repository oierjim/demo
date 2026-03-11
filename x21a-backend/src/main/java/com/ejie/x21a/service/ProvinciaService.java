package com.ejie.x21a.service;

import com.ejie.x21a.model.Provincia;
import com.ejie.x21a.repository.ProvinciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProvinciaService {
    @Autowired
    private ProvinciaRepository provinciaRepository;

    public List<Provincia> findAll() {
        return provinciaRepository.findAll();
    }
    
    public void saveAll(List<Provincia> provincias) {
        provinciaRepository.saveAll(provincias);
    }
}
