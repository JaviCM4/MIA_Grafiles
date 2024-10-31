import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Credencial } from "../models/Credencial";
import { Observable } from "rxjs";
import { Trabajador } from "../models/Trabajador";

@Injectable({providedIn: "root"})
export class TrabajadorService {

    readonly DIRECCION_API= "http://localhost:8080/trabajadores";
    
    constructor(private httpClient: HttpClient) {}

    public validarCredencialesTrabajador(credencial: Credencial) : Observable <number> {
        return this.httpClient.post<number>(this.DIRECCION_API + "/validar", credencial);
    }

    public crearTrabajador(trabajador: Trabajador) : Observable<any> {
        return this.httpClient.post<any>(this.DIRECCION_API, trabajador);
    }

    public actualizarContraseña(credencial: Credencial) : Observable<any> {
        return this.httpClient.post<any>(this.DIRECCION_API + "/actualizar", credencial);
    }

    public obtenerTrabajador(usuario: string) : Observable <Trabajador> {
        return this.httpClient.get<Trabajador>(this.DIRECCION_API + "/" + usuario);
    }

    public obtenerTrabajadores() : Observable <Trabajador[]> {
        return this.httpClient.get<Trabajador[]>(this.DIRECCION_API + "/lista");
    }
}