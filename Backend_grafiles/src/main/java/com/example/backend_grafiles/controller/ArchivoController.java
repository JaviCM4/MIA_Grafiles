package com.example.backend_grafiles.controller;

import com.example.backend_grafiles.model.Archivo;
import com.example.backend_grafiles.service.ArchivoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("archivos")
@CrossOrigin(origins = "http://localhost:4200")
public class ArchivoController {

    @Autowired
    private ArchivoService archivoService;

    @PostMapping()
    public ResponseEntity<Map<String, String>> crearArchivo(@RequestBody Archivo archivo) {
        String mensaje = archivoService.verificarArchivoACrear(archivo);

        Map<String, String> response = new HashMap<>();
        response.put("mensaje", mensaje);

        return ResponseEntity.ok(response);
    }

    @PutMapping()
    public ResponseEntity<Map<String, String>> actualizarArchivo(@RequestBody Archivo archivo) {
        String mensaje =  archivoService.actualizarArchivo(archivo);

        Map<String, String> response = new HashMap<>();
        response.put("mensaje", mensaje);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{no}")
    public ResponseEntity<Map<String, String>> marcarArchivoInactivo(@PathVariable int no) {
        String mensaje = archivoService.marcarArchivoInactivo(no);

        Map<String, String> response = new HashMap<>();
        response.put("mensaje", mensaje);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{no}")
    public ResponseEntity<Archivo> obtenerArchivo(@PathVariable int no) {
        Optional<Archivo> archivoOptional = archivoService.obtenerArchivo(no);
        return archivoOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{usuario}/{padre}")
    public ResponseEntity<List<Archivo>> obtenerArchivos(@PathVariable String usuario, @PathVariable String padre) {
        List<Archivo> archivos = archivoService.obtenerListaArchivosActivos(usuario, padre, true);
        return new ResponseEntity<>(archivos, HttpStatus.OK);
    }

    @GetMapping("/inactivos/{usuario}")
    public ResponseEntity<List<Archivo>> obtenerArchivosPorUsuario(@PathVariable String usuario) {
        List<Archivo> archivos = archivoService.obtenerListaArchivosInactivos(usuario, false);
        return new ResponseEntity<>(archivos, HttpStatus.OK);
    }

    @GetMapping("/mover/{envia}/{recibe}")
    public ResponseEntity<Map<String, String>> moverFichero(@PathVariable int envia, @PathVariable int recibe) {
        String mensaje = archivoService.moverArchivo(envia, recibe);

        Map<String, String> response = new HashMap<>();
        response.put("mensaje", mensaje);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/subir")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("image") MultipartFile file) {
        try {
            String ruta = "/app/images/";
            File dest = new File(ruta + file.getOriginalFilename()); // Crea el archivo de destino
            file.transferTo(dest);

            String mensaje = file.getOriginalFilename();
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", mensaje);

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            e.printStackTrace();

            String mensaje = "Error al subir la imagen: " + e.getMessage();
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", mensaje);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); // Cambié a 500 en caso de error
        }
    }

    @GetMapping("/imagen/{filename}")
    public ResponseEntity<FileSystemResource> getImage(@PathVariable String filename) {
        try {
            String ruta = "/app/images/"; // Ruta donde se guardan las imágenes
            File file = new File(ruta + filename);

            if (file.exists()) {
                FileSystemResource resource = new FileSystemResource(file);
                HttpHeaders headers = new HttpHeaders();
                headers.add("Content-Type", "image/jpeg"); // Cambia el tipo de contenido según sea necesario
                return new ResponseEntity<>(resource, headers, HttpStatus.OK);
            } else {
                return ResponseEntity.notFound().build(); // Si no se encuentra el archivo
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



    // Prueba de Implementación de de Copia de Archivo
    @GetMapping("/copiar/{no}")
    public ResponseEntity<Map<String, String>> copiarArchivo(@PathVariable int no) {
        String mensaje = archivoService.copiarArchivo(no);

        Map<String, String> response = new HashMap<>();
        response.put("mensaje", mensaje);

        return ResponseEntity.ok(response);
    }
}
