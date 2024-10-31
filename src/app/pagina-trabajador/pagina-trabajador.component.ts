import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BarraNavegacionComponent } from "../barra-navegacion/barra-navegacion.component";
import { TrabajadorService } from '../../services/TrabajadorService';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Trabajador } from '../../models/Trabajador';

@Component({
  selector: 'app-pagina-trabajador',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, BarraNavegacionComponent],
  templateUrl: './pagina-trabajador.component.html',
  styleUrl: './pagina-trabajador.component.css'
})
export class PaginaTrabajadorComponent implements OnInit {
  formCrear!: FormGroup;
  formActualizar!: FormGroup;
  trabajadorVista!: Trabajador;
  mostrarFormCrear: boolean = false;
  id: string | null = null;
  usuario!: string

  constructor(private formBuilder: FormBuilder,
              private trabajadorService: TrabajadorService,
              private route: ActivatedRoute,
              private dataService: DataService) {
  }

  ngOnInit(): void {
    this.usuario = this.dataService.getData('usuario')
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');

      if (this.id == "1") {
        this.mostrarFormCrear = true;
  
        this.formCrear = this.formBuilder.group({
          usuario: [null,  [Validators.required, Validators.maxLength(25)]],
          nombres: [null,  [Validators.required, Validators.maxLength(75)]],
          apellidos: [null,  [Validators.required, Validators.maxLength(75)]],
          correo: [null,  [Validators.required, Validators.maxLength(75)]],
          clave: [null,  [Validators.required, Validators.maxLength(25)]]
        })
      } else {
        this.mostrarFormCrear = false;
  
        this.formActualizar = this.formBuilder.group({
          clave: [null,  [Validators.required, Validators.maxLength(25)]]
        })
        this.obtenerTrabajador()
      }
    });
  }

  crearTrabajador(): void {
    const trabajadorNuevo = {
      usuario: this.formCrear.value.usuario,
      nombres: this.formCrear.value.nombres,
      apellidos: this.formCrear.value.apellidos,
      correo: this.formCrear.value.correo,
      puesto: 2,
      clave: this.formCrear.value.clave
    }

    if (this.formCrear.valid) {
      this.trabajadorService.crearTrabajador(trabajadorNuevo).subscribe({
        next: (respuesta: any) => {
          alert(respuesta.mensaje)
          this.formCrear.reset()
        },
        error: (error: any) => {
          console.error("Error al eliminar los Ficheros: " + error)
        }
      })
    } else {
      alert("Debes llenar todos los Campos")
    }
  }

  obtenerTrabajador(): void {
    this.trabajadorService.obtenerTrabajador(this.usuario).subscribe({
      next: (trabajador: Trabajador) => {
        this.trabajadorVista = trabajador
      },
      error: (error: any) => {
        console.error("Error al eliminar los Ficheros: " + error)
      }
    })
  }

  actualizarDatos(): void {
    const credencialAActualizar = {
      usuario: this.usuario,
      clave: this.formActualizar.value.clave
    }
    this.trabajadorService.actualizarContraseña(credencialAActualizar).subscribe({
      next: (respuesta: any) => {
        alert(respuesta.mensaje)
        this.formActualizar.reset()
      },
      error: (error: any) => {
        console.error("Error al eliminar los Ficheros: " + error)
      }
    })
  }
}
