import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FicheroService } from '../../services/FicheroService';
import { Fichero } from '../../models/Fichero';
import { CommonModule } from '@angular/common';
import { ArchivoService } from '../../services/ArchivoService';
import { Archivo } from '../../models/Archivo';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompartidoService } from '../../services/CompartidoService';
import { Router } from '@angular/router';
import { BarraNavegacionComponent } from "../barra-navegacion/barra-navegacion.component";

@Component({
  selector: 'app-pagina-principal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BarraNavegacionComponent],
  templateUrl: './pagina-principal.component.html',
  styleUrl: './pagina-principal.component.css'
})
export class PaginaPrincipalComponent implements OnInit {
  opcionesFichero: { [key: number]: boolean } = {};  
  opcionesArchivo: { [key: number]: boolean } = {}; 
  /* Ficheros */
  ficheros: Fichero[] = [];
  ficherosTotal: Fichero[] = [];
  ficheroActual!: Fichero;
  ficheroAnterior!: Fichero;
  /* Archivos */
  archivos: Archivo[] = [];
  archivoEditado!: Archivo;
  /* String */
  usuario!: string;
  raiz: string = "_";
  mensaje!: string;
  /* Formularios */
  formFichero!: FormGroup;
  formArchivo!: FormGroup;
  formMoverFichero!: FormGroup;
  formArchivoEditado!: FormGroup;
  formArchivoCompartido!: FormGroup;
  /* Booleanos */
  mostrarFormularioFichero: boolean = false;
  mostrarFormularioArchivo: boolean = false;
  mostrarFormularioMover: boolean = false;
  mostrarFormularioCompartir: boolean = false;
  deseaMoverFichero: boolean = false;
  mostrarArchivoEditado: boolean = false;
  /* File */
  file!: File;
  /* Extras */
  indiceFicheroOArchivo: number = -1;
  indiceArchivoACompartir: number = -1;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private ficheroService: FicheroService,
              private archivoService: ArchivoService,
              private compartidoService: CompartidoService,
              private formBuilder: FormBuilder,
              private dataService: DataService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.usuario = this.dataService.getData('usuario')
    this.formFichero = this.formBuilder.group({
      nombre: [null,  [Validators.required, Validators.maxLength(25)]]
    })
    this.formArchivo = this.formBuilder.group({
      nombre: [null, [Validators.required, Validators.maxLength(25)]],
      contenido: [null, [Validators.required, Validators.maxLength(25)]],
      extension: [null, [Validators.required]]
    })
    this.formMoverFichero = this.formBuilder.group({
      posicion: [null, [Validators.required]]
    })
    this.formArchivoEditado = this.formBuilder.group({
      contenido: [null, [Validators.required, Validators.maxLength(250)]]
    })
    this.formArchivoCompartido = this.formBuilder.group({
      usuario: [null, [Validators.required, Validators.maxLength(25)]]
    })
    this.obtenerFicheroPrincipal();
  }


  /* Formularios de Fichero y Archivo */
  mostrarFormFichero() {
    if (this.mostrarFormularioFichero) {
      this.mostrarFormularioFichero = false;
    } else {
      this.mostrarFormularioFichero = true;
    }
    this.mostrarFormularioArchivo = false;
    //Desactivar
    this.mostrarFormularioMover = false;
    this.mostrarFormularioCompartir = false;
  }

  mostrarFormArchivo() {
    if (this.mostrarFormularioArchivo) {
      this.mostrarFormularioArchivo = false;
    } else {
      this.mostrarFormularioArchivo = true;
    }
    this.mostrarFormularioFichero = false;
    //Desactivar
    this.mostrarFormularioMover = false;
    this.mostrarFormularioCompartir = false;
  }

  crearFichero() {
    const regex = /^[a-zA-Z0-9\s]*$/;
    const ficheroNuevo = {
      no: 0,
      usuario: this.usuario,
      padre: this.ficheroActual.nombre,
      nombre: this.formFichero.value.nombre,
      activo: true,
      fecha: ""
    }

    var esValido: boolean = true;
    esValido = regex.test(ficheroNuevo.nombre);

    if (esValido) {
      this.ficheroService.crearFichero(ficheroNuevo).subscribe({
        next: (respuesta: any) => {
          alert(respuesta.mensaje)
          this.obtenerFicheros()
          this.obtenerArchivos()
        },
        error: (error: any) => {
          console.log("Error al crear el Fichero: " + error)
        }
      })
      this.mostrarFormularioFichero = false;
    } else {
      alert("El nombre del Fichero no puedo contener Caracteres Especiales")
    }
  }

  crearArchivo() {
    const regex = /^[a-zA-Z0-9\s]*$/;
    const archivoNuevo = {
      no: 0,
      usuario: this.usuario,
      padre: this.ficheroActual.nombre,
      nombre: this.formArchivo.value.nombre,
      contenido: "",
      extension: this.formArchivo.value.extension,
      activo: true,
      copiar: false,
      fecha: ""
    }

    var esValido: boolean = true;
    esValido = regex.test(archivoNuevo.nombre);

    if (esValido) {
      this.archivoService.crearArchivo(archivoNuevo).subscribe({
        next: (respuesta: any) => {
          alert(respuesta.mensaje)
          this.obtenerFicheros()
          this.obtenerArchivos()
        },
        error: (error: any) => {
          console.log("Error al crear el Fichero: " + error)
        }
      })
      this.mostrarFormularioArchivo = false;
    } else {
      alert("El nombre del Archivo no puedo contener Caracteres Especiales")
    }
  }



  /* Obtenemos el Fichero raíz del usuario y buscamos todos los Fichero y Archivos que tenga dentro de él */
  obtenerFicheroPrincipal(): void {
    this.ficheroService.obtenerFicheros(this.usuario, "_").subscribe({
      next: (ficheros: Fichero[]) => {
        this.ficheroActual = ficheros[0]
        this.ficheroAnterior = this.ficheroActual
        this.obtenerFicheros()
        this.obtenerArchivos()
      },
      error: (error: any) => {
        console.log("Error al obtener el Fichero Principal: " + error)
      }
    })
  }

  obtenerFicheros(): void {
    const nombreFicheroPadre = this.ficheroActual.nombre

    this.ficheroService.obtenerFicheros(this.usuario, nombreFicheroPadre).subscribe({
      next: (ficheros: Fichero[]) => {
        this.ficheros = ficheros
      },
      error: (error: any) => {
        console.log("Error al Obtener los Ficheros: " + error)
      }
    })
  }

  obtenerArchivos(): void {
    const nombreFicheroPadre = this.ficheroActual.nombre

    this.archivoService.obtenerArchivos(this.usuario, nombreFicheroPadre).subscribe({
      next: (archivos: Archivo[]) => {
        this.archivos = archivos
      },
      error: (error: any) => {
        console.log("Error al Obtener los Archivos: " + error)
      }
    })
  }






  irFicheroAnterior(): void {
    this.ficheroActual = this.ficheroAnterior;

    if (this.ficheroActual.padre != "_") {
      this.ficheroService.obtenerFicheroAnterior(this.usuario, this.ficheroAnterior.padre).subscribe({
        next: (ficheroAnterior: Fichero) => {
          this.ficheroAnterior = ficheroAnterior
        },
        error: (error: any) => {
          console.log("Error al Obtener los Ficheros: " + error)
        }
      })
    }

    this.obtenerFicheros()
    this.obtenerArchivos()
  }











  /* --------------------------------------- Opciones del Fichero --------------------------------------- */
  opcionesDelFichero(indice: number): void {
    this.opcionesFichero[indice] = !this.opcionesFichero[indice];
  }

  verFichero(indice: number): void {
    this.ficheroAnterior = this.ficheroActual
    this.ficheroActual = this.ficheros[indice]

    this.obtenerFicheros()
    this.obtenerArchivos()
  }

  eliminarFichero(indice: number): void {
    this.ficheroService.marcarFicheroInactivo(this.ficheros[indice].no).subscribe({
      next: (respuesta: any) => {
        alert("Mensajes: " + respuesta.mensaje)
        this.obtenerFicheros()
        this.obtenerArchivos()
      },
      error: (error: any) => {
        console.error("Error al eliminar los Ficheros: " + error)
      }
    })
  }






  /* --------------------------------------- Opciones del Archivo --------------------------------------- */
  opcionesDelArchivo(indice: number): void {
    this.opcionesArchivo[indice] = !this.opcionesArchivo[indice];
  }

  verArchivo(indice: number): void {
    this.mostrarArchivoEditado = true;
    this.archivoEditado = this.archivos[indice];
    this.formArchivoEditado.patchValue({
      contenido: this.archivoEditado.contenido
    });
    if (this.archivoEditado.contenido != "") {
      this.cargarImagen()
    }
  }

  guadarCambiosArchivo(): void {
    this.mostrarArchivoEditado = false;
    this.archivoEditado.contenido = this.formArchivoEditado.value.contenido;

    this.archivoService.actualizarArchivo(this.archivoEditado).subscribe ({
      next: (respuesta: any) => {
        alert("Mensajes: " + respuesta.mensaje)
      },
      error: (error: any) => {
        console.error("Error al eliminar los Archivos: " + error)
      }
    })
  }

  volverAlFichero(): void {
    this.mostrarArchivoEditado = false;
    this.imagePreview = null;
  }

  mostrarFormCompartir(indice: number): void {
    this.mostrarFormularioCompartir = true
    this.indiceArchivoACompartir = indice
    // Desactivar
    this.mostrarFormularioFichero = false;
    this.mostrarFormularioArchivo = false;
    this.mostrarFormularioMover = false;
  }

  cerrarFormCompartir(): void {
    this.mostrarFormularioCompartir = false
  }

  copiarArchivo(indice: number): void {
    this.archivoService.copiarArchivoExistente(this.archivos[indice].no).subscribe({
      next: (respuesta: any) => {
        alert("Mensajes: " + respuesta.mensaje)
        this.obtenerFicheros()
        this.obtenerArchivos()
      },
      error: (error: any) => {
        console.error("Error al eliminar los Archivos: " + error)
      }
    })
  }

  compartirArchivo(): void {
    this.mostrarFormularioCompartir = false

    const archivoCompartido = {
      no: 0,
      emisor: this.archivos[this.indiceArchivoACompartir].usuario,
      receptor: this.formArchivoCompartido.value.usuario,
      nombre: this.archivos[this.indiceArchivoACompartir].nombre,
      contenido: this.archivos[this.indiceArchivoACompartir].contenido,
      extension: this.archivos[this.indiceArchivoACompartir].extension,
      fecha: ""
    }

    this.compartidoService.crearCompartido(archivoCompartido).subscribe({
      next: (respuesta: any) => {
        alert("Mensajes: " + respuesta.mensaje)
      },
      error: (error: any) => {
        console.error("Error al eliminar los Archivos: " + error)
      }
    })
  }

  eliminarArchivo(indice: number): void {
    this.archivoService.marcarArchivoInactivo(this.archivos[indice].no).subscribe({
      next: (respuesta: any) => {
        alert("Mensajes: " + respuesta.mensaje)
        this.obtenerFicheros()
        this.obtenerArchivos()
      },
      error: (error: any) => {
        console.error("Error al eliminar los Archivos: " + error)
      }
    })
  }













  /* ---------------------------- Mover Fichero o Archivo (Método Compartido) --------------------------- */
  mostrarTodosLosFicheros(indice: number, quien: number): void {
    this.mostrarFormularioMover = true;
    this.indiceFicheroOArchivo = indice;
    // Desactivar
    this.mostrarFormularioFichero = false;
    this.mostrarFormularioArchivo = false;
    this.mostrarFormularioCompartir = false;

    if (quien == 1) {
      this.deseaMoverFichero = true;
    } else {
      this.deseaMoverFichero = false;
    }

    this.ficheroService.obtenerTodosLosFicheros(this.usuario).subscribe({
      next: (ficherosTotal: Fichero[]) => {
        this.ficherosTotal = ficherosTotal;
      },
      error: (error: any) => {
        console.error("Error al eliminar los Ficheros: " + error)
      }
    })
  }

  moverFicheroOArchivo() {
    this.mostrarFormularioMover = false;

    if (this.deseaMoverFichero) {
      this.ficheroService.moverFichero(this.ficheros[this.indiceFicheroOArchivo].no, this.formMoverFichero.value.posicion).subscribe({
        next: (respuesta: any) => {
          alert("Mover Mensaje: " + respuesta.mensaje)
          this.obtenerFicheros()
          this.obtenerArchivos()
        },
        error: (error: any) => {
          console.error("Error al Mover el Fichero: " + error)
        }
      })
    } else {
      this.archivoService.moverArchivo(this.archivos[this.indiceFicheroOArchivo].no, this.formMoverFichero.value.posicion).subscribe({
        next: (respuesta: any) => {
          alert("Mover Mensaje: " + respuesta.mensaje)
          this.obtenerFicheros()
          this.obtenerArchivos()
        },
        error: (error: any) => {
          console.error("Error al Mover el Archivo: " + error)
        }
      })
    }
  }

  cerrarFormMover(): void {
    this.mostrarFormularioMover = false
  }




















  seleccionarImagen(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      this.file = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.file);

      // *****
    }
  }

  guardarImagen() {
    this.archivoService.enviarImagen(this.file).subscribe({
      next: (respuesta: any) => {
        this.archivoEditado.contenido = this.file.name
        console.log(this.archivoEditado);
        
        this.archivoService.actualizarArchivo(this.archivoEditado).subscribe({
          next: (respuesta: any) => {
            alert("Mensajes: " + respuesta.mensaje)
          },
          error: (error: any) => {
            console.error("Error al eliminar los Archivos: " + error)
          }
        })
        
      },
      error: (error: any) => {
        console.error("Error al IMG: " + error)
      }
    });
  }

  cargarImagen(): void {
    this.archivoService.obtenerImagen(this.archivoEditado.contenido).subscribe({
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
}



/* 
• Ciclos biogeoquímicos  
POBLACIONES 
 • Conceptos poblacionales  
• Evolución, selección natural y reproducción diferencial 
 • Propiedades de las poblaciones 
 • Factores que determinan la magnitud de la población  
• Poblaciones humanas  
 
ECOSISTEMAS 
 • Definición de ecosistemas, hábitat y nicho ecológico 
 • Comunidad biótica, bioma, provincia biótica, biósfera. 
 • Homeostasis  
 • Desarrollo y evolución del ecosistema  
• Estratificación de los ecosistemas
*/