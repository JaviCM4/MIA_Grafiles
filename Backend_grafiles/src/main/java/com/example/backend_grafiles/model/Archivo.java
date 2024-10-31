package com.example.backend_grafiles.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "archivos")
public class Archivo {

    @Id
    private int no;
    private String usuario;
    private String padre;
    private String nombre;
    private String contenido;
    private String extension;
    private boolean activo;
    private boolean copia;
    private String fecha;
}
