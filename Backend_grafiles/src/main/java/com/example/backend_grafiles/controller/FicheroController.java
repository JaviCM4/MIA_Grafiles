package com.example.backend_grafiles.controller;

import com.example.backend_grafiles.model.Fichero;
import com.example.backend_grafiles.service.FicheroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/ficheros")
@CrossOrigin(origins = "http://localhost:4200")
public class FicheroController {

    @Autowired
    private FicheroService ficheroService;

    @PostMapping()
    public ResponseEntity<Map<String, String>> crearFichero(@RequestBody Fichero fichero) {
        String mensaje =  ficheroService.crearFichero(fichero);

        Map<String, String> response = new HashMap<>();
        response.put("mensaje", mensaje);

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<Map<String, String>> actualizarFichero(@RequestBody Fichero fichero) {
        String mensaje =  ficheroService.actualizarFichero(fichero);

        Map<String, String> response = new HashMap<>();
        response.put("mensaje", mensaje);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{no}")
    public ResponseEntity<Map<String, String>> marcarFicheroInactivo(@PathVariable int no) {
        String mensaje = ficheroService.marcarFicheroInactivo(no);

        Map<String, String> response = new HashMap<>();
        response.put("mensaje", mensaje);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{no}")
    public ResponseEntity<Fichero> obtenerFichero(@PathVariable int no) {
        Optional<Fichero> ficheroOptional = ficheroService.obtenerFichero(no);
        return ficheroOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/anterior/{usuario}/{nombre}")
    public ResponseEntity<Fichero> obtenerFicheroAnterior(@PathVariable String usuario, @PathVariable String nombre) {
        Optional<Fichero> ficheroOptional = ficheroService.obtenerFicheroAnterior(usuario, nombre, true);
        return ficheroOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/personal/{usuario}/{padre}")
    public ResponseEntity<List<Fichero>> obtenerFicheros(@PathVariable String usuario, @PathVariable String padre) {
        List<Fichero> ficheros = ficheroService.obtenerListaFicherosActivos(usuario, padre, true);
        return new ResponseEntity<>(ficheros, HttpStatus.OK);
    }

    @GetMapping("/todos/{usuario}")
    public ResponseEntity<List<Fichero>> obtenerListaDeTodosLosFicheros(@PathVariable String usuario) {
        List<Fichero> ficheros = ficheroService.obtenerListaDeTodosLosFicheros(usuario, true);
        return new ResponseEntity<>(ficheros, HttpStatus.OK);
    }

    @GetMapping("/mover/{envia}/{recibe}")
    public ResponseEntity<Map<String, String>> moverFichero(@PathVariable int envia, @PathVariable int recibe) {
        String mensaje = ficheroService.moverFichero(envia, recibe);

        Map<String, String> response = new HashMap<>();
        response.put("mensaje", mensaje);

        return ResponseEntity.ok(response);
    }
}
