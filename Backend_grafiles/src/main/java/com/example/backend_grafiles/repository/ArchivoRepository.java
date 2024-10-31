package com.example.backend_grafiles.repository;

import com.example.backend_grafiles.model.Archivo;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ArchivoRepository extends MongoRepository<Archivo, Integer> {

    List<Archivo> findByUsuarioAndPadreAndActivo(String usuario, String padre, boolean activo);

    List<Archivo> findByUsuarioAndActivo(String usuario, boolean activo);

    List<Archivo> findByUsuarioAndNombreAndPadreAndActivo(String usuario, String nombre, String padre, boolean activo);
}
