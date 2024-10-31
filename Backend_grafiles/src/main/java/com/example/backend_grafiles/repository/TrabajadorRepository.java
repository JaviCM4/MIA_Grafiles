package com.example.backend_grafiles.repository;

import com.example.backend_grafiles.model.Trabajador;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TrabajadorRepository extends MongoRepository<Trabajador, String> {

    Optional<Trabajador> findByUsuarioAndClave(String usuario, String clave);
}
