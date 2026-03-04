package com.ejie.x21a.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;

import com.ejie.x21a.model.FilterRequest;
import org.springframework.transaction.annotation.Transactional;

public abstract class BaseService<T, ID, F> {
    
    protected abstract JpaRepository<T, ID> getRepository();
    
    protected abstract Specification<T> getSpecification(F filter);

    @Transactional
    public void deleteMultiple(FilterRequest<F> request) {
        if (request.isSelectAll()) {
            // Caso 1: Borrar todo lo que cumpla el filtro EXCEPTO los deseleccionados
            JpaSpecificationExecutor<T> executor = (JpaSpecificationExecutor<T>) getRepository();
            Specification<T> spec = getSpecification(request.getFilter());
            
            List<T> itemsToDelete = executor.findAll(spec);
            itemsToDelete.forEach(item -> {
                try {
                    // Usamos Reflection para obtener el id
                    // 1. Obtener el resultado como Object
                    Object idValue = item.getClass().getMethod("getId").invoke(item);

                    // 2. Convertirlo a String de forma segura
                    String id = (idValue != null) ? idValue.toString() : null;
                    if (request.getDeselectedIds() == null || !request.getDeselectedIds().contains(id)) {
                        getRepository().delete(item);
                    }
                } catch (Exception e) {
                    getRepository().delete(item);
                }
            });
        } else {
            // Caso 2: Borrar solo los IDs seleccionados explícitamente
            if (request.getSelectedIds() != null) {
                request.getSelectedIds().forEach(id -> getRepository().deleteById((ID) id));
            }
        }
    }

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
}