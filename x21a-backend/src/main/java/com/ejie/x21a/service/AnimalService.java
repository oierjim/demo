package com.ejie.x21a.service;

import com.ejie.x21a.model.Animal;
import com.ejie.x21a.model.filter.AnimalFilter;
import com.ejie.x21a.repository.AnimalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class AnimalService extends BaseService<Animal, Long, AnimalFilter> {
    @Autowired
    private AnimalRepository repository;

    @Override
    protected JpaRepository<Animal, Long> getRepository() {
        return repository;
    }

    @Override
    protected org.springframework.data.jpa.domain.Specification<Animal> getSpecification(AnimalFilter filter) {
        return (root, query, cb) -> {
            java.util.List<javax.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();
            if (filter == null) return cb.conjunction();
            if (filter.getNombre() != null && !filter.getNombre().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("nombre")), "%" + filter.getNombre().toLowerCase() + "%"));
            }
            if (filter.getRaza() != null && !filter.getRaza().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("raza")), "%" + filter.getRaza().toLowerCase() + "%"));
            }
            return cb.and(predicates.toArray(new javax.persistence.criteria.Predicate[0]));
        };
    }
}