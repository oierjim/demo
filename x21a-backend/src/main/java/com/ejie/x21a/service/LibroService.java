package com.ejie.x21a.service;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ejie.x21a.model.Libro;
import com.ejie.x21a.model.filter.LibroFilter;
import com.ejie.x21a.repository.LibroRepository;
import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Service
public class LibroService extends BaseService<Libro, String, LibroFilter> {

    @Autowired
    private LibroRepository repository;

    @Override
    protected JpaRepository<Libro, String> getRepository() {
        return repository;
    }

    @Override
    protected Specification<Libro> getSpecification(LibroFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (filter != null) {
                if (filter.getIsbn() != null && !filter.getIsbn().isEmpty()) {
                    predicates.add(cb.like(cb.lower(root.get("isbn")), "%" + filter.getIsbn().toLowerCase() + "%"));
                }
                if (filter.getTitulo() != null && !filter.getTitulo().isEmpty()) {
                    predicates.add(cb.like(cb.lower(root.get("titulo")), "%" + filter.getTitulo().toLowerCase() + "%"));
                }
                if (filter.getAutor() != null && !filter.getAutor().isEmpty()) {
                    predicates.add(cb.like(cb.lower(root.get("autor")), "%" + filter.getAutor().toLowerCase() + "%"));
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
