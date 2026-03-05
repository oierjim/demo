package com.ejie.x21a.control;

import com.ejie.x21a.model.Serie;
import com.ejie.x21a.model.filter.SerieFilter;
import com.ejie.x21a.service.BaseService;
import com.ejie.x21a.service.SerieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import javax.annotation.PostConstruct;
import java.util.Date;
import java.util.Random;

@RestController
@RequestMapping("/series")
public class SerieController extends BaseController<Serie, Long, SerieFilter> {

    @Autowired
    private SerieService service;

    @Override
    protected BaseService<Serie, Long, SerieFilter> getService() {
        return service;
    }

    @PostConstruct
    public void init() {
        if (service.findAll().isEmpty()) {
            String[] tipos = {"Comedia", "Drama", "Ciencia Ficción", "Terror", "Acción"};
            String[] plataformas = {"Netflix", "HBO Max", "Disney+", "Amazon Prime", "Apple TV+"};
            String[] titulos = {"The Office", "Breaking Bad", "Stranger Things", "Succession", "The Boys", 
                               "The Bear", "Ted Lasso", "Severance", "The Last of Us", "Shogun"};
            Random rand = new Random();
            
            for (int i = 1; i <= 100; i++) {
                Serie serie = new Serie();
                serie.setTitulo(titulos[i % titulos.length] + " " + (i / titulos.length + 1));
                serie.setTipo(tipos[i % tipos.length]);
                serie.setPlataforma(plataformas[i % plataformas.length]);
                serie.setFechaEstreno(new Date(System.currentTimeMillis() - (long)rand.nextInt(30) * 24 * 3600 * 1000));
                service.save(serie);
            }
        }
    }
}