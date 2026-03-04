package com.ejie.x21a.service;

import com.ejie.x21a.model.Expediente;
import com.ejie.x21a.model.filter.ExpedienteFilter;
import com.ejie.x21a.repository.ExpedienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExpedienteService extends BaseService<Expediente, String, ExpedienteFilter> {
    @Autowired
    private ExpedienteRepository repository;

    @Override
    protected JpaRepository<Expediente, String> getRepository() {
        return repository;
    }

    @Override
    protected Specification<Expediente> getSpecification(ExpedienteFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (filter == null) return cb.conjunction();

            if (filter.getReferencia() != null && !filter.getReferencia().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("referencia")), "%" + filter.getReferencia().toLowerCase() + "%"));
            }
            if (filter.getEstado() != null && !filter.getEstado().isEmpty()) {
                predicates.add(cb.equal(root.get("estado"), filter.getEstado()));
            }
            if (filter.getFechaAperturaDesde() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("fechaApertura"), filter.getFechaAperturaDesde()));
            }
            if (filter.getFechaAperturaHasta() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("fechaApertura"), filter.getFechaAperturaHasta()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}