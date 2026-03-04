package com.ejie.x21a.repository;

import com.ejie.x21a.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonaRepository extends JpaRepository<Persona, String>, JpaSpecificationExecutor<Persona> {
}