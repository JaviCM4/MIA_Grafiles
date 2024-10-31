package com.example.backend_grafiles.controller;

import com.example.backend_grafiles.model.Credencial;
import com.example.backend_grafiles.model.Trabajador;
import com.example.backend_grafiles.service.TrabajadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/trabajadores")
@CrossOrigin(origins = "http://localhost:4200")
public class TrabajadorController {

    @Autowired
    private TrabajadorService trabajadorService;

    @PostMapping()
    public ResponseEntity<Map<String, String>> crearTrabajador(@RequestBody Trabajador trabajador) {
        String mensaje = trabajadorService.crearTrabajador(trabajador);

        Map<String, String> response = new HashMap<>();
        response.put("mensaje", mensaje);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/validar")
    public int validarCredencialesTrabajador(@RequestBody Credencial credencial) {
        return trabajadorService.validarCredencialesTrabajador(credencial);
    }

    @PostMapping("/actualizar")
    public ResponseEntity<Map<String, String>> actualizarClave(@RequestBody Credencial credencial) {
        String mensaje = trabajadorService.actualizarClave(credencial);

        Map<String, String> response = new HashMap<>();
        response.put("mensaje", mensaje);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{usuario}")
    public ResponseEntity<Trabajador> obtenerTrabajador(@PathVariable String usuario) {
        Optional<Trabajador> trabajadorOptional = trabajadorService.obtenerTrabajador(usuario);
        return trabajadorOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/lista")
    public ResponseEntity<List<Trabajador>> obtenerTrabajadores() {
        List<Trabajador> trabajadores = trabajadorService.obtenerTrabajadores();
        return new ResponseEntity<>(trabajadores, HttpStatus.OK);
    }
}
