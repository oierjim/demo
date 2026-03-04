package com.ejie.x21a.service;

import com.ejie.x21a.model.Persona;
import com.ejie.x21a.model.filter.PersonaFilter;
import com.ejie.x21a.repository.PersonaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Service
public class PersonaService extends BaseService<Persona, String, PersonaFilter> {
    @Autowired
    private PersonaRepository repository;

    @Override
    protected JpaRepository<Persona, String> getRepository() {
        return repository;
    }

    @Override
    protected Specification<Persona> getSpecification(PersonaFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (filter == null) return cb.conjunction();

            if (filter.getDni() != null && !filter.getDni().isEmpty()) {
                predicates.add(cb.equal(cb.upper(root.get("dni")), filter.getDni().toUpperCase()));
            }
            if (filter.getNombre() != null && !filter.getNombre().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("nombre")), "%" + filter.getNombre().toLowerCase() + "%"));
            }
            if (filter.getApellido1() != null && !filter.getApellido1().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("apellido1")), "%" + filter.getApellido1().toLowerCase() + "%"));
            }
            if (filter.getEmail() != null && !filter.getEmail().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("email")), "%" + filter.getEmail().toLowerCase() + "%"));
            }
            if (filter.getFechaNacimientoDesde() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("fechaNacimiento"), filter.getFechaNacimientoDesde()));
            }
            if (filter.getFechaNacimientoHasta() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("fechaNacimiento"), filter.getFechaNacimientoHasta()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}