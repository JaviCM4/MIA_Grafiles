package com.example.backend_grafiles.controller;

import com.example.backend_grafiles.model.Compartido;
import com.example.backend_grafiles.service.CompartidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("compartidos")
@CrossOrigin(origins = "http://localhost:4200")
public class CompartidoController {

    @Autowired
    private CompartidoService compartidoService;

    @PostMapping()
    public ResponseEntity<Map<String, String>> crearCompartido(@RequestBody Compartido compartido) {
        String mensaje = compartidoService.crearCompartido(compartido);

        Map<String, String> response = new HashMap<>();
        response.put("mensaje", mensaje);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/lista/{usuario}")
    public ResponseEntity<List<Compartido>> obtenerCompartidos(@PathVariable String usuario) {
        List<Compartido> compartidos = compartidoService.obtenerCompartidos(usuario);
        return new ResponseEntity<>(compartidos, HttpStatus.OK);
    }

    @DeleteMapping("/{no}")
    public ResponseEntity<Map<String, String>> eliminarCompartido(@PathVariable int no) {
        String mensaje = compartidoService.eliminarCompartido(no);

        Map<String, String> response = new HashMap<>();
        response.put("mensaje", mensaje);

        return ResponseEntity.ok(response);
    }
}
