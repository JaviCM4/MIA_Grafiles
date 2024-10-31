package com.example.backend_grafiles.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "trabajadores")
public class Trabajador {

    @Id
    private String usuario;
    private String nombres;
    private String apellidos;
    private String correo;  
    private int puesto;
    private String clave;
}
