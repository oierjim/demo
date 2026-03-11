package com.ejie.x21a.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import com.ejie.x21a.model.Libro;

@Repository
public interface LibroRepository extends JpaRepository<Libro, String>, JpaSpecificationExecutor<Libro> {
}
