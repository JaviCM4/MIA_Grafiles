package com.example.backend_grafiles.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ficheros")
public class Fichero {

    @Id
    private int no;
    private String usuario;
    private String padre;
    private String nombre;
    private boolean activo;
    private String fecha;
}
