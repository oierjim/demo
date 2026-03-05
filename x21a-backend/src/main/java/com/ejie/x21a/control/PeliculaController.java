package com.ejie.x21a.control;

import com.ejie.x21a.model.Pelicula;
import com.ejie.x21a.model.filter.PeliculaFilter;
import com.ejie.x21a.service.BaseService;
import com.ejie.x21a.service.PeliculaService;
import javax.annotation.PostConstruct;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Date;
import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/pelicula")
public class PeliculaController extends BaseController<Pelicula, Long, PeliculaFilter> {

    @Autowired
    private PeliculaService service;

    @Override
    protected BaseService<Pelicula, Long, PeliculaFilter> getService() {
        return service;
    }

    @PostConstruct
    public void init() {
        if (service.findAll().isEmpty()) {
            String[] titulos = {"El Padrino", "Pulp Fiction", "Inception", "Matrix", "Interstellar", "Star Wars", "Blade Runner", "Alien", "Titanic", "Seven"};
            String[] directores = {"Scorsese", "Tarantino", "Nolan", "Wachowski", "Scott", "Cameron", "Fincher", "Spielberg"};
            String[] generos = {"Drama", "Acción", "Ciencia Ficción", "Terror", "Suspense"};
            Random rand = new Random();
            
            for (int i = 0; i < 100; i++) {
                Pelicula p = new Pelicula();
                p.setTitulo(titulos[i % titulos.length] + " " + (i + 1));
                p.setDirector(directores[rand.nextInt(directores.length)]);
                p.setGenero(generos[rand.nextInt(generos.length)]);
                p.setFechaEstreno(new Date(System.currentTimeMillis() - (long)rand.nextInt(30) * 24 * 3600 * 1000));
                p.setDuracion(90 + rand.nextInt(90));
                p.setOscar(rand.nextBoolean());
                service.save(p);
            }
        }
    }
}
