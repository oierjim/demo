package com.ejie.x21a.service;

import com.ejie.x21a.model.Pelicula;
import com.ejie.x21a.model.filter.PeliculaFilter;
import com.ejie.x21a.repository.PeliculaRepository;
import javax.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class PeliculaService extends BaseService<Pelicula, Long, PeliculaFilter> {

    private final PeliculaRepository repository;

    public PeliculaService(PeliculaRepository repository) {
        this.repository = repository;
    }

    @Override
    protected JpaRepository<Pelicula, Long> getRepository() {
        return repository;
    }

    @Override
    protected Specification<Pelicula> getSpecification(PeliculaFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (filter != null) {
                if (filter.getTitulo() != null && !filter.getTitulo().isEmpty()) {
                    predicates.add(cb.like(cb.lower(root.get("titulo")), "%" + filter.getTitulo().toLowerCase() + "%"));
                }
                if (filter.getGenero() != null && !filter.getGenero().isEmpty()) {
                    predicates.add(cb.equal(root.get("genero"), filter.getGenero()));
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
