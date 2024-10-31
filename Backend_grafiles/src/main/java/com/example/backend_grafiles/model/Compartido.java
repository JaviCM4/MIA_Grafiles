package com.example.backend_grafiles.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "compartidos")
public class Compartido {

    @Id
    private int no;
    private String emisor;
    private String receptor;
    private String nombre;
    private String contenido;
    private String extension;
    private String fecha;
}
