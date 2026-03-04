package com.ejie.x21a.repository;

import com.ejie.x21a.model.Expediente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpedienteRepository extends JpaRepository<Expediente, String>, JpaSpecificationExecutor<Expediente> {
}