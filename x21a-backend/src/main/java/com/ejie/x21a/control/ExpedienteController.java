package com.ejie.x21a.control;

import com.ejie.x21a.model.Expediente;
import com.ejie.x21a.model.filter.ExpedienteFilter;
import com.ejie.x21a.service.BaseService;
import com.ejie.x21a.service.ExpedienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import javax.annotation.PostConstruct;
import java.util.Date;
import java.util.Random;

@RestController
@RequestMapping("/expedientes")
public class ExpedienteController extends BaseController<Expediente, String, ExpedienteFilter> {

    @Autowired
    private ExpedienteService service;

    @Autowired
    private com.ejie.x21a.service.ProvinciaService provinciaService;

    @Autowired
    private com.ejie.x21a.service.MunicipioService municipioService;

    @Override
    protected BaseService<Expediente, String, ExpedienteFilter> getService() {
        return service;
    }

    @PostConstruct
    public void init() {
        if (service.findAll().isEmpty()) {
            String[] estados = {"Abierto", "En Proceso", "Pendiente", "Cerrado"};
            String[] solicitantes = {"Juan Pérez", "María García", "Antonio López", "Laura Sánchez", "Carlos Rodríguez"};
            String[] tramites = {"Registro inicial", "Validación de documentos", "Revisión técnica", "Firma autorizada", "Cierre administrativo"};
            
            var provincias = provinciaService.findAll();
            var municipios = municipioService.findAll();
            
            Random rand = new Random();
            
            for (int i = 0; i < 100; i++) {
                Expediente exp = new Expediente();
                exp.setReferencia(String.format("EXP-2024-%03d", i + 1));
                exp.setSolicitante(solicitantes[i % solicitantes.length]);
                exp.setEstado(estados[i % estados.length]);
                exp.setFechaApertura(new Date(System.currentTimeMillis() - (long)rand.nextInt(30) * 24 * 3600 * 1000));
                
                if (!provincias.isEmpty()) {
                    var prov = provincias.get(i % provincias.size());
                    exp.setProvincia(prov);
                    
                    var munisProv = municipios.stream()
                        .filter(m -> m.getProvinciaId().equals(prov.getId()))
                        .toList();
                    if (!munisProv.isEmpty()) {
                        exp.setMunicipio(munisProv.get(i % munisProv.size()));
                    }
                }

                exp.setUltimoTramite(tramites[i % tramites.length]);
                if ("Cerrado".equals(exp.getEstado())) {
                    exp.setFechaCierre(new Date());
                }
                
                service.save(exp);
            }
        }
    }
}