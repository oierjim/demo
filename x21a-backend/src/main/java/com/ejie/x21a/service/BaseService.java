package com.ejie.x21a.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;

public abstract class BaseService<T, ID, F> {
    
    protected abstract JpaRepository<T, ID> getRepository();
    
    // Cada servicio específico implementará su propia lógica de filtrado
    protected abstract Specification<T> getSpecification(F filter);

    public Page<T> filter(F filter, Pageable pageable) {
        JpaSpecificationExecutor<T> executor = (JpaSpecificationExecutor<T>) getRepository();
        Specification<T> spec = getSpecification(filter);
        return executor.findAll(spec, pageable);
    }

    public List<T> findAll() {
        return getRepository().findAll();
    }

    public T findById(ID id) {
        return getRepository().findById(id).orElse(null);
    }

    public T save(T entity) {
        return getRepository().save(entity);
    }

    public void deleteById(ID id) {
        getRepository().deleteById(id);
    }

    public void deleteMultiple(List<ID> ids) {
        ids.forEach(id -> getRepository().deleteById(id));
    }
}