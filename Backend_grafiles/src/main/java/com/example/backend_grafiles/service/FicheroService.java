package com.example.backend_grafiles.service;

import com.example.backend_grafiles.model.Archivo;
import com.example.backend_grafiles.model.Fichero;
import com.example.backend_grafiles.repository.FicheroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class FicheroService {

    @Autowired
    private FicheroRepository ficheroRepository;

    @Autowired
    private ArchivoService archivoService;

    public String crearFichero(Fichero fichero) {
        try {
            Fichero ficherosExistentes = ficheroRepository.findByUsuarioAndNombreAndPadreAndActivo(fichero.getUsuario(), fichero.getNombre(), fichero.getPadre(), true);
            int numeroFicheros = ficheroRepository.findAll().size();

            if (ficherosExistentes == null) {
                fichero.setNo(numeroFicheros + 1);
                SimpleDateFormat formatoFecha = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
                String fechaActual = formatoFecha.format(new Date());

                fichero.setFecha(fechaActual);
                ficheroRepository.save(fichero);
                return "Fichero Creado Correctamente";
            } else {
                return "El Nombre del Fichero ya Existen";
            }
        } catch (Exception e) {
            return "Error al Crear el Fichero";
        }
    }

    public String actualizarFichero(Fichero fichero) {
        try {
            ficheroRepository.save(fichero);
            return "Actualización Exitosa";
        } catch (Exception e) {
            return "Error al realizar la Actualización: " + e.getMessage();
        }
    }

    public String marcarFicheroInactivo(int no) {
        try {
            Optional<Fichero> ficheroOptional = ficheroRepository.findById(no);

            if (ficheroOptional.isPresent()) {
                Fichero fichero = ficheroOptional.get();
                fichero.setActivo(false);
                ficheroRepository.save(fichero);
                inactivarArchivosDelFichero(fichero.getUsuario(), fichero.getNombre());
                inactivarFicheros(fichero.getUsuario(), fichero.getNombre());
                return "Fichero Eliminado";
            } else {
                return "No se encontro el Fichero";
            }
        } catch (Exception e) {
            return "Error al eliminar el Fichero: " + e.getMessage();
        }
    }

    private void inactivarFicheros(String usuario, String padre) {
        List<Fichero> ficheroActual = obtenerListaFicherosActivos(usuario, padre, true);

        if (!ficheroActual.isEmpty()) {
            for (Fichero fichero : ficheroActual) {
                if (fichero.isActivo()) {
                    fichero.setActivo(false);
                    ficheroRepository.save(fichero);
                    inactivarArchivosDelFichero(fichero.getUsuario(), fichero.getNombre());
                    inactivarFicheros(fichero.getUsuario(), fichero.getNombre());
                }
            }
        }
    }

    private void inactivarArchivosDelFichero(String usuario, String padre) {
        List<Archivo> archivosDelFichero = archivoService.obtenerListaArchivosActivos(usuario, padre, true);

        for (Archivo archivo : archivosDelFichero) {
            archivo.setActivo(false);
            archivoService.actualizarArchivo(archivo);
        }
    }

    public Optional<Fichero> obtenerFichero(int no) {
        return ficheroRepository.findById(no);
    }

    public Optional<Fichero> obtenerFicheroAnterior(String usuario, String nombre, boolean activo) {
        return ficheroRepository.findByUsuarioAndNombreAndActivo(usuario, nombre, activo);
    }

    public List<Fichero> obtenerListaFicherosActivos(String usuario, String padre, boolean activo) {
        return ficheroRepository.findByUsuarioAndPadreAndActivo(usuario, padre, activo);
    }

    public List<Fichero> obtenerListaDeTodosLosFicheros(String usuario, boolean activo) {
        return ficheroRepository.findByUsuarioAndActivo(usuario, activo);
    }

    public String moverFichero(int noEnvia, int noRecibe) {
        Fichero ficheroEnviado = ficheroRepository.findById(noEnvia).get();
        Fichero ficheroRecibe = ficheroRepository.findById(noRecibe).get();

        ficheroEnviado.setPadre(ficheroRecibe.getNombre());
        ficheroRepository.save(ficheroEnviado);
        return "Se movio el Fichero (" + ficheroEnviado.getNombre() + ") al Fichero (" + ficheroRecibe.getNombre() + ")";
    }
}
