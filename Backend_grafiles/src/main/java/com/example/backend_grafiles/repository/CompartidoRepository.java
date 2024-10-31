package com.example.backend_grafiles.repository;

import com.example.backend_grafiles.model.Compartido;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CompartidoRepository extends MongoRepository<Compartido, Integer> {

    List<Compartido> findByReceptor(String receptor);
}
