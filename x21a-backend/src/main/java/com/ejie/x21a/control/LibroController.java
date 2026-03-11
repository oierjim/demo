package com.ejie.x21a.control;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ejie.x21a.model.Libro;
import com.ejie.x21a.model.filter.LibroFilter;
import com.ejie.x21a.service.BaseService;
import com.ejie.x21a.service.LibroService;
import javax.annotation.PostConstruct;
import java.util.Date;

@RestController
@RequestMapping("/libros")
public class LibroController extends BaseController<Libro, String, LibroFilter> {

    @Autowired
    private LibroService service;

    @Override
    protected BaseService<Libro, String, LibroFilter> getService() {
        return service;
    }

    @PostConstruct
    public void init() {
        if (service.findAll().isEmpty()) {
            for (int i = 1; i <= 25; i++) {
                Libro libro = new Libro();
                libro.setIsbn("978-84-" + String.format("%05d", i));
                libro.setTitulo("Libro de Prueba " + i);
                libro.setAutor("Autor " + (i % 5 + 1));
                libro.setEstrellas((i % 5) + 1);
                libro.setFechaPublicacion(new Date());
                service.save(libro);
            }
        }
    }
}
