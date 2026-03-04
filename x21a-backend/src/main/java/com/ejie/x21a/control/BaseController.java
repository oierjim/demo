package com.ejie.x21a.control;

import com.ejie.x21a.model.FilterRequest;
import com.ejie.x21a.service.BaseService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public abstract class BaseController<T, ID, F> {

    protected abstract BaseService<T, ID, F> getService();

    @PostMapping("/filter")
    public Map<String, Object> filter(@RequestBody FilterRequest<F> request) {
        Sort sort = Sort.unsorted();
        if (request.getSidx() != null && !request.getSidx().isEmpty()) {
            sort = "desc".equalsIgnoreCase(request.getSord()) 
                   ? Sort.by(request.getSidx()).descending() 
                   : Sort.by(request.getSidx()).ascending();
        }

        Pageable pageable = PageRequest.of(request.getPage(), request.getRows(), sort);
        Page<T> resultPage = getService().filter(request.getFilter(), pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("data", resultPage.getContent());
        response.put("totalRecords", resultPage.getTotalElements());
        response.put("page", resultPage.getNumber());
        
        return response;
    }

    @GetMapping
    public List<T> getAll() {
        return getService().findAll();
    }

    @GetMapping("/{id}")
    public T getById(@PathVariable ID id) {
        return getService().findById(id);
    }

    @PostMapping
    public T create(@RequestBody T entity) {
        return getService().save(entity);
    }

    @PutMapping("/{id}")
    public T update(@PathVariable ID id, @RequestBody T entity) {
        return getService().save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable ID id) {
        getService().deleteById(id);
    }

    @PostMapping("/delete-multiple")
    public void deleteMultiple(@RequestBody List<ID> ids) {
        getService().deleteMultiple(ids);
    }
}