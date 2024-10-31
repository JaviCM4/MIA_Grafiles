package com.example.backend_grafiles.repository;

import com.example.backend_grafiles.model.Fichero;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface FicheroRepository extends MongoRepository<Fichero, Integer> {

    List<Fichero> findByUsuarioAndPadreAndActivo(String usuario, String padre, boolean activo);

    Optional<Fichero> findByUsuarioAndNombreAndActivo(String usuario, String nombre, boolean activo);

    List<Fichero> findByUsuarioAndActivo(String usuario, boolean activo);

    Fichero findByUsuarioAndNombreAndPadreAndActivo(String usuario, String nombre, String padre, boolean activo);
}
