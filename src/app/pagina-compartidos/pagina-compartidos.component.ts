import { Component, OnInit } from '@angular/core';
import { CompartidoService } from '../../services/CompartidoService';
import { DataService } from '../data.service';
import { Compartido } from '../../models/Compartido';
import { CommonModule } from '@angular/common';
import { BarraNavegacionComponent } from "../barra-navegacion/barra-navegacion.component";
import { ArchivoService } from '../../services/ArchivoService';

@Component({
  selector: 'app-pagina-compartidos',
  standalone: true,
  imports: [CommonModule, BarraNavegacionComponent],
  templateUrl: './pagina-compartidos.component.html',
  styleUrl: './pagina-compartidos.component.css'
})
export class PaginaCompartidosComponent implements OnInit {
  opcionesArchivoCompartido: { [key: number]: boolean } = {};
  compartidos: Compartido[] = []; 
  compartidoVista!: Compartido;
  mostrarVista: boolean = false;
  usuario!: string;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private archivoService: ArchivoService,
              private compartidoService: CompartidoService,
              private dataService: DataService) {
  }
  
  ngOnInit(): void {
    this.usuario = this.dataService.getData('usuario')
    this.mostrarArchivosCompartidos()
  }

  mostrarArchivosCompartidos() {
    this.compartidoService.obtenerMisArchivosCompartidos(this.usuario).subscribe({
      next: (compartidos: Compartido[]) => {
        this.compartidos = compartidos
      },
      error: (error: any) => {
        console.log("Error al Obtener los Archivos Compartidos: " + error)
      }
    })
  }

  quitarVistaArchivo() {
    this.mostrarVista = false;
  }

  opcionesDelArchivoCompartido(indice: number) {
    this.opcionesArchivoCompartido[indice] = !this.opcionesArchivoCompartido[indice];
  }

  verArchivo(indice: number) {
    this.mostrarVista = true;
    this.compartidoVista = this.compartidos[indice]
    this.cargarImagen()
  }

  cargarImagen(): void {
    this.archivoService.obtenerImagen(this.compartidoVista.contenido).subscribe({
      next: (blob: Blob) => {

        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string; // Convertir blob a URL
        };
        reader.readAsDataURL(blob); // Leer el blob como una URL de datos
      },
      error: (error: any) => {
        console.error("Error al recuperar la imagen: ", error);
      }
    });
  }

  eliminarArchivo(indice: number) {
    this.compartidoService.eliminarArchivoCompartido(this.compartidos[indice].no).subscribe({
      next: (respuesta: any) => {
        alert("Mensajes: " + respuesta.mensaje)
        this.mostrarArchivosCompartidos()
      },
      error: (error: any) => {
        console.log("Error al Obtener los Archivos Compartidos: " + error)
      }
    })
  }
}
