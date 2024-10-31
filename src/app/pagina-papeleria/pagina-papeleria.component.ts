import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Archivo } from '../../models/Archivo';
import { ArchivoService } from '../../services/ArchivoService';
import { TrabajadorService } from '../../services/TrabajadorService';
import { Trabajador } from '../../models/Trabajador';
import { CommonModule } from '@angular/common';
import { BarraNavegacionComponent } from "../barra-navegacion/barra-navegacion.component";

@Component({
  selector: 'app-pagina-papeleria',
  standalone: true,
  imports: [CommonModule, BarraNavegacionComponent],
  templateUrl: './pagina-papeleria.component.html',
  styleUrl: './pagina-papeleria.component.css'
})
export class PaginaPapeleriaComponent implements OnInit {
  opcionesArchivoPapeleria: { [key: number]: boolean } = {};
  opcionesArchivoIndividual: { [key: number]: boolean } = {};
  trabajadores: Trabajador[] = [];
  archivos: Archivo[] = [];
  archivoVista!: Archivo;
  mostrarArchivos: boolean = false;
  mostrarVista: boolean = false;
  usuario!: string;

  constructor(private trabajadorService: TrabajadorService,
              private archivoService: ArchivoService,
              private dataService: DataService) {
  }

  ngOnInit(): void {
    this.usuario = this.dataService.getData('usuario')
    this.mostrarListaTrabajadores()
  }

  mostrarListaTrabajadores(): void {
    this.trabajadorService.obtenerTrabajadores().subscribe({
      next: (trabajadores: Trabajador[]) => {
        this.trabajadores = trabajadores
      },
      error: (error: any) => {
        console.log("Error al Obtener los Trabajadores: " + error)
      }
    })
  }

  mostrarListaArchivosUsuario(indice: number): void {
    this.mostrarArchivos = true;

    this.archivoService.obtenerArchivosInactivos(this.trabajadores[indice].usuario).subscribe({
      next: (archivo: Archivo[]) => {
        this.archivos = archivo
      },
      error: (error: any) => {
        console.log("Error al Obtener los Trabajadores: " + error)
      }
    })
  }

  quitarVistaArchivo() {
    this.mostrarVista = false;
  }

  quitarVistaLista() {
    this.mostrarArchivos = false;
  }

  opcionesDelFicheroUsuario(indice: number) {
    this.opcionesArchivoPapeleria[indice] = !this.opcionesArchivoPapeleria[indice];
  }

  opcionesDelArchivoIndividual(indice: number) {
    this.opcionesArchivoIndividual[indice] = !this.opcionesArchivoIndividual[indice];
  }

  verArchivo(indice: number) {
    this.mostrarVista = true
    this.archivoVista = this.archivos[indice]
  }
}
