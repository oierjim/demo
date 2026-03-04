package com.ejie.x21a.control;

import com.ejie.x21a.model.Animal;
import com.ejie.x21a.model.filter.AnimalFilter;
import com.ejie.x21a.service.BaseService;
import com.ejie.x21a.service.AnimalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/animales")
public class AnimalController extends BaseController<Animal, Long, AnimalFilter> {
    @Autowired
    private AnimalService service;

    @Override
    protected BaseService<Animal, Long, AnimalFilter> getService() {
        return service;
    }
}