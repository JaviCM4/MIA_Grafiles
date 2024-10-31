import { Routes } from '@angular/router';
import { IniciarSesionComponent } from './iniciar-sesion/iniciar-sesion.component';
import { PaginaPrincipalComponent } from './pagina-principal/pagina-principal.component';
import { PaginaCompartidosComponent } from './pagina-compartidos/pagina-compartidos.component';
import { PaginaPapeleriaComponent } from './pagina-papeleria/pagina-papeleria.component';
import { PaginaTrabajadorComponent } from './pagina-trabajador/pagina-trabajador.component';

export const routes: Routes = [
    { path: 'pagina-trabajador/:id', component: PaginaTrabajadorComponent },
    { path: 'pagina-papeleria', component: PaginaPapeleriaComponent },
    { path: 'pagina-compartidos', component: PaginaCompartidosComponent },
    { path: 'pagina-principal', component: PaginaPrincipalComponent },
    { path: 'iniciar-sesion', component: IniciarSesionComponent },
    { path: '', redirectTo: '/iniciar-sesion', pathMatch: 'full' }
];
