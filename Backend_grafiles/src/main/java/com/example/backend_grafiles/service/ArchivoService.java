package com.example.backend_grafiles.service;

import com.example.backend_grafiles.model.Archivo;
import com.example.backend_grafiles.model.Fichero;
import com.example.backend_grafiles.repository.ArchivoRepository;
import com.example.backend_grafiles.repository.FicheroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ArchivoService {

    @Autowired
    private ArchivoRepository archivoRepository;

    @Autowired
    private FicheroRepository ficheroRepository;

    public String verificarArchivoACrear(Archivo archivo) {
        try {
            List<Archivo> archivoExistente = archivoRepository.findByUsuarioAndNombreAndPadreAndActivo(archivo.getUsuario(), archivo.getNombre(), archivo.getPadre(), true);
            int numeroArchivos = archivoRepository.findAll().size();

            if (archivoExistente.isEmpty()) {
                archivo.setNo(numeroArchivos + 1);
                SimpleDateFormat formatoFecha = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
                String fechaActual = formatoFecha.format(new Date());

                archivo.setFecha(fechaActual);
                archivoRepository.save(archivo);
                return "Archivo Creado Correctamente";
            } else {
                boolean noRepetido = true;

                for (Archivo value : archivoExistente) {
                    if (Objects.equals(archivo.getExtension(), value.getExtension())) {
                        noRepetido = false;
                        break;
                    }
                }
                if (noRepetido) {
                    archivo.setNo(numeroArchivos + 1);
                    SimpleDateFormat formatoFecha = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
                    String fechaActual = formatoFecha.format(new Date());

                    archivo.setFecha(fechaActual);
                    archivoRepository.save(archivo);
                    return "Archivo Creado Correctamente";
                }
            }
            return "El Nombre y Extensión de Archivo ya Existen";
        } catch (Exception e) {
            return "Error al intentar crer el archivo: " + e.getMessage();
        }
    }

    public String actualizarArchivo(Archivo archivo) {
        try {
            archivoRepository.save(archivo);
            return "Actualización Exitosa";
        } catch (Exception e) {
            return "Error al realizar la Actualización: " + e.getMessage();
        }
    }

    public String marcarArchivoInactivo(int no) {
        try {
            Optional<Archivo> archivoOptional = archivoRepository.findById(no);

            if (archivoOptional.isPresent()) {
                Archivo archivo = archivoOptional.get();
                archivo.setActivo(false);
                archivoRepository.save(archivo);
                return "Archivo Eliminado";
            } else {
                return "No se encontro el Archivo";
            }
        } catch (Exception e) {
            return "Error al eliminar el Archivo: " + e.getMessage();
        }
    }

    public Optional<Archivo> obtenerArchivo(int no) {
        return archivoRepository.findById(no);
    }

    public List<Archivo> obtenerListaArchivosActivos(String usuario, String padre, boolean activo) {
        return archivoRepository.findByUsuarioAndPadreAndActivo(usuario, padre, activo);
    }

    public List<Archivo> obtenerListaArchivosInactivos(String usuario, boolean activo) {
        return archivoRepository.findByUsuarioAndActivo(usuario, activo);
    }

    public String moverArchivo(int noEnvia, int noRecibe) {
        Archivo archivoEnviado = archivoRepository.findById(noEnvia).get();
        Fichero ficheroRecibe = ficheroRepository.findById(noRecibe).get();

        archivoEnviado.setPadre(ficheroRecibe.getNombre());

        archivoRepository.save(archivoEnviado);
        return "Se movio el Archivo (" + archivoEnviado.getNombre() + ") al Fichero (" + ficheroRecibe.getNombre() + ")";
    }

    public String copiarArchivo(int no) {
        Archivo archivoACopiar = archivoRepository.findById(no).get();
        String nombre = archivoACopiar.getNombre();

        if (!archivoACopiar.isCopia()) {

            archivoACopiar.setCopia(true);
            archivoRepository.save(archivoACopiar);

            archivoACopiar.setCopia(false);
            archivoACopiar.setNombre(archivoACopiar.getNombre() + "(COPIA)");
            verificarArchivoACrear(archivoACopiar);

            return "Archivo (" + nombre + ") copiado Correctamente";
        } else {
            return "El Archivo (" + nombre + ") ya cuenta con una Copia";
        }
    }
}
