package com.ejie.x21a.repository;

import com.ejie.x21a.model.Municipio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MunicipioRepository extends JpaRepository<Municipio, String> {
    List<Municipio> findByProvinciaId(String provinciaId);
}
