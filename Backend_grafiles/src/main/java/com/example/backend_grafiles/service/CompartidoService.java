package com.example.backend_grafiles.service;

import com.example.backend_grafiles.model.Compartido;
import com.example.backend_grafiles.model.Trabajador;
import com.example.backend_grafiles.repository.CompartidoRepository;
import com.example.backend_grafiles.repository.TrabajadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CompartidoService {

    @Autowired
    private CompartidoRepository compartidoRepository;

    @Autowired
    private TrabajadorRepository trabajadorRepository;

    public String crearCompartido(Compartido compartido){
        try {
            Optional<Trabajador> trabajador = trabajadorRepository.findById(compartido.getReceptor());

            if (trabajador.isPresent()) {
                int numeroDeCompartidos = compartidoRepository.findAll().size();
                compartido.setNo(numeroDeCompartidos + 1);

                SimpleDateFormat formatoFecha = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
                String fechaActual = formatoFecha.format(new Date());

                compartido.setFecha(fechaActual);
                compartidoRepository.save(compartido);
                return "Archivo Compartido Existosamente";
            } else {
                return "No existe Trabajador con ese Usuario";
            }
        } catch (Exception e) {
            return "Error al Compartir el Archivo";
        }
    }

    public List<Compartido> obtenerCompartidos(String usuario){
        return compartidoRepository.findByReceptor(usuario);
    }

    public String eliminarCompartido(int no) {
        try {
            Compartido compartido = compartidoRepository.findById(no).get();
            compartidoRepository.delete(compartido);
            return "Archivo Compartido Eliminado";
        } catch (Exception e) {
            return "Error al Eliminar el Archivo Compartido";
        }
    }
}
