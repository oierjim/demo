package com.ejie.x21a.control;

import com.ejie.x21a.model.ComboElemento;
import com.ejie.x21a.model.Municipio;
import com.ejie.x21a.model.Provincia;
import com.ejie.x21a.service.MunicipioService;
import com.ejie.x21a.service.ProvinciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/combos")
public class ComboController {

    @Autowired
    private ProvinciaService provinciaService;

    @Autowired
    private MunicipioService municipioService;

    @PostConstruct
    public void init() {
        if (provinciaService.findAll().isEmpty()) {
            List<Provincia> provincias = new ArrayList<>();
            provincias.add(new Provincia("01", "Araba/Álava", "Araba"));
            provincias.add(new Provincia("20", "Gipuzkoa", "Gipuzkoa"));
            provincias.add(new Provincia("48", "Bizkaia", "Bizkaia"));
            provinciaService.saveAll(provincias);

            List<Municipio> municipios = new ArrayList<>();
            // Araba
            municipios.add(new Municipio("01059", "01", "Vitoria-Gasteiz", "Vitoria-Gasteiz"));
            municipios.add(new Municipio("01002", "01", "Amurrio", "Amurrio"));
            municipios.add(new Municipio("01036", "01", "Laudio/Llodio", "Laudio"));
            // Gipuzkoa
            municipios.add(new Municipio("20069", "20", "Donostia/San Sebastián", "Donostia"));
            municipios.add(new Municipio("20045", "20", "Irun", "Irun"));
            municipios.add(new Municipio("20030", "20", "Eibar", "Eibar"));
            // Bizkaia
            municipios.add(new Municipio("48020", "48", "Bilbao", "Bilbo"));
            municipios.add(new Municipio("48013", "48", "Barakaldo", "Barakaldo"));
            municipios.add(new Municipio("48044", "48", "Getxo", "Getxo"));
            
            municipios.add(new Municipio("48036", "48", "Galdakao", "Galdakao"));
            
            municipioService.saveAll(municipios);
        }
    }

    @GetMapping("/provincias")
    public List<ComboElemento> getProvincias() {
        return provinciaService.findAll().stream()
                .map(p -> new ComboElemento(p.getId(), p.getDescripcionC(), p.getDescripcionE()))
                .collect(Collectors.toList());
    }

    @GetMapping("/municipios")
    public List<ComboElemento> getMunicipios(@RequestParam(required = false) String provinciaId) {
        List<Municipio> municipios;
        if (provinciaId != null && !provinciaId.isEmpty()) {
            municipios = municipioService.findByProvinciaId(provinciaId);
        } else {
            municipios = municipioService.findAll();
        }
        return municipios.stream()
                .map(m -> new ComboElemento(m.getId(), m.getDescripcionC(), m.getDescripcionE()))
                .collect(Collectors.toList());
    }
}
