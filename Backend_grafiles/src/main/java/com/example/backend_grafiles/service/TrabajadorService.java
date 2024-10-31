package com.example.backend_grafiles.service;

import com.example.backend_grafiles.model.Credencial;
import com.example.backend_grafiles.model.Fichero;
import com.example.backend_grafiles.model.Trabajador;
import com.example.backend_grafiles.repository.TrabajadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class TrabajadorService {

    @Autowired
    private TrabajadorRepository trabajadorRepository;

    @Autowired
    private FicheroService ficheroService;

    public String crearTrabajador(Trabajador trabajador) {
        try {
            trabajadorRepository.save(trabajador);
            LocalDate fechaActual = LocalDate.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            String fechaString = fechaActual.format(formatter);
            Fichero ficheroRaiz = new Fichero(0, trabajador.getUsuario(), "_", "Principal", true, fechaString);
            ficheroService.crearFichero(ficheroRaiz);
            return "Trabajador creado Exitosamente";
        } catch (Exception e) {
            return "Error al crear el Trabajador";
        }
    }

    public int validarCredencialesTrabajador(Credencial credencial) {
        Optional<Trabajador> trabajadorEntrante = trabajadorRepository.findByUsuarioAndClave(credencial.getUsuario(), credencial.getClave());

        if (trabajadorEntrante.isPresent()) {
            Trabajador trabajador = trabajadorEntrante.get();
            return trabajador.getPuesto();
        } else {
            return -1;
        }
    }

    public String actualizarClave(Credencial credencial) {
        Optional<Trabajador> trabajadorAActualizar = obtenerTrabajador(credencial.getUsuario());

        if (trabajadorAActualizar.isPresent()) {
            Trabajador trabajador = trabajadorAActualizar.get();
            trabajador.setClave(credencial.getClave());
            trabajadorRepository.save(trabajador);
            return "Contraseña actualizada Exitosamente";
        } else {
            return "No se encontro el Trabajador";
        }
    }

    public Optional<Trabajador> obtenerTrabajador(String usuario) {
        return trabajadorRepository.findById(usuario);
    }

    public List<Trabajador> obtenerTrabajadores() {
        return trabajadorRepository.findAll();
    }
}
