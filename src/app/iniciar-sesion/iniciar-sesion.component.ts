import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Credencial } from '../../models/Credencial';
import { TrabajadorService } from '../../services/TrabajadorService';
import { DataService } from '../data.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { BarraNavegacionComponent } from "../barra-navegacion/barra-navegacion.component";

@Component({
  selector: 'app-iniciar-sesion',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, BarraNavegacionComponent],
  templateUrl: './iniciar-sesion.component.html',
  styleUrl: './iniciar-sesion.component.css'
})
export class IniciarSesionComponent implements OnInit {
  formLogin!: FormGroup

  constructor(private formBuilder: FormBuilder, 
              private trabajadorService: TrabajadorService, 
              private dataService: DataService,
              private router: Router) {
    
  }

  ngOnInit(): void {
    this.formLogin = this.formBuilder.group({
      usuario: [null,  [Validators.required, Validators.maxLength(25)]],
      clave: [null,  [Validators.required, Validators.maxLength(25)]]
    });
  }

  iniciarSesion(): void {
    if (this.formLogin.valid) {
      const credencial = this.formLogin.value as Credencial

      this.trabajadorService.validarCredencialesTrabajador(credencial).subscribe({
        next: (puesto: number) => {
          if (puesto != -1) {
            this.dataService.setData('usuario', credencial.usuario)
            this.dataService.setData('rol', puesto)
            this.router.navigateByUrl("/pagina-principal");
          } else {
            alert("Usuario no Encontrado")
          }
        },
        error: (error: any) => {
          alert("Error: " + error)
        }
      })
    } else {
      alert("Debe llenar todos los Campos")
    }
  }
}
