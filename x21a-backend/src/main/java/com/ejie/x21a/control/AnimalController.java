package com.ejie.x21a.control;

import com.ejie.x21a.model.Animal;
import com.ejie.x21a.model.filter.AnimalFilter;
import com.ejie.x21a.service.BaseService;
import com.ejie.x21a.service.AnimalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import javax.annotation.PostConstruct;
import java.util.Date;
import java.util.Random;

@RestController
@RequestMapping("/animales")
public class AnimalController extends BaseController<Animal, Long, AnimalFilter> {

    @Autowired
    private AnimalService service;

    @Override
    protected BaseService<Animal, Long, AnimalFilter> getService() {
        return service;
    }

    @PostConstruct
    public void init() {
        if (service.findAll().isEmpty()) {
            String[] nombres = {"Rex", "Luna", "Toby", "Bella", "Coco", "Kira", "Max", "Lola", "Thor", "Mia"};
            String[] razas = {"Pastor Alemán", "Labrador", "Golden Retriever", "Beagle", "Boxer", "Bulldog", "Poodle", "Husky", "Dálmata", "Chihuahua"};
            Random rand = new Random();
            
            for (int i = 1; i <= 100; i++) {
                Animal animal = new Animal();
                animal.setNombre(nombres[i % nombres.length] + " " + i);
                animal.setRaza(razas[i % razas.length]);
                animal.setFechaNacimiento(new Date(System.currentTimeMillis() - (long)rand.nextInt(3650) * 24 * 3600 * 1000));
                animal.setPeso(5.0 + rand.nextDouble() * 30.0);
                animal.setAltura(20.0 + rand.nextDouble() * 60.0);
                
                service.save(animal);
            }
        }
    }
}