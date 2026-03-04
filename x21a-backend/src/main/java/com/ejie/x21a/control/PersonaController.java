package com.ejie.x21a.control;

import com.ejie.x21a.model.Persona;
import com.ejie.x21a.model.filter.PersonaFilter;
import com.ejie.x21a.service.BaseService;
import com.ejie.x21a.service.PersonaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.util.Calendar;
import java.util.Date;

@RestController
@RequestMapping("/personas")
public class PersonaController extends BaseController<Persona, String, PersonaFilter> {

    @Autowired
    private PersonaService service;

    @Override
    protected BaseService<Persona, String, PersonaFilter> getService() {
        return service;
    }

    @PostConstruct
    public void init() {
        if (service.findAll().isEmpty()) {
            String[] nombres = {"Mikel", "Ane", "Jon", "Itziar", "Gorka", "Maite", "Xabier", "Amaia", "Iñigo", "Nerea"};
            String[] apellidos = {"Etxeberria", "García", "Zubizarreta", "López", "Agirre", "Rodríguez", "Otxoa", "Martínez", "Ibarra", "Sánchez"};
            
            for (int i = 1; i <= 100; i++) {
                Persona p = new Persona();
                p.setDni(String.format("%08d%c", 12345678 + i, "TRWAGMYFPDXBNJZSQVHLCKE".charAt((12345678 + i) % 23)));
                p.setNombre(nombres[i % nombres.length]);
                p.setApellido1(apellidos[i % apellidos.length]);
                p.setApellido2(apellidos[(i + 1) % apellidos.length]);
                p.setEmail(p.getNombre().toLowerCase() + "." + p.getApellido1().toLowerCase() + i + "@example.com");
                
                Calendar cal = Calendar.getInstance();
                cal.set(1970 + (i % 40), i % 12, (i % 28) + 1);
                p.setFechaNacimiento(cal.getTime());
                
                service.save(p);
            }
        }
    }
}