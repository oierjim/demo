package com.ejie.x21a.service;

import com.ejie.x21a.model.Serie;
import com.ejie.x21a.model.filter.SerieFilter;
import com.ejie.x21a.repository.SerieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Service
public class SerieService extends BaseService<Serie, Long, SerieFilter> {

    @Autowired
    private SerieRepository repository;

    @Override
    protected JpaRepository<Serie, Long> getRepository() {
        return repository;
    }

    @Override
    protected Specification<Serie> getSpecification(SerieFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (filter != null) {
                if (filter.getTitulo() != null && !filter.getTitulo().isEmpty()) {
                    predicates.add(cb.like(cb.lower(root.get("titulo")), "%" + filter.getTitulo().toLowerCase() + "%"));
                }
                if (filter.getTipo() != null && !filter.getTipo().isEmpty()) {
                    predicates.add(cb.equal(root.get("tipo"), filter.getTipo()));
                }
                if (filter.getPlataforma() != null && !filter.getPlataforma().isEmpty()) {
                    predicates.add(cb.equal(root.get("plataforma"), filter.getPlataforma()));
                }
                if (filter.getFechaEstrenoDesde() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("fechaEstreno"), filter.getFechaEstrenoDesde()));
                }
                if (filter.getFechaEstrenoHasta() != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get("fechaEstreno"), filter.getFechaEstrenoHasta()));
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}