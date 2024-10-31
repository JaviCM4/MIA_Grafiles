import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Fichero } from "../models/Fichero";

@Injectable({providedIn: "root"})
export class FicheroService {

    readonly DIRECCION_API= "http://localhost:8080/ficheros";
    
    constructor(private httpClient: HttpClient) {}

    public crearFichero(fichero: Fichero) : Observable<any> {
        return this.httpClient.post<any>(this.DIRECCION_API, fichero);
    }

    public obtenerFichero(no: number) : Observable <Fichero> {
        return this.httpClient.get<Fichero>(this.DIRECCION_API + "/" + no);
    }

    public obtenerFicheroAnterior(usuario: string, nombre: string) : Observable <Fichero> {
        return this.httpClient.get<Fichero>(this.DIRECCION_API + "/anterior/" + usuario + "/" + nombre);
    }

    public obtenerFicheros(usuario: string, path: string) : Observable <Fichero[]> {
        return this.httpClient.get<Fichero[]>(this.DIRECCION_API + "/personal/" + usuario + "/" + path);
    }

    public obtenerTodosLosFicheros(usuario: string) : Observable <Fichero[]> {
        return this.httpClient.get<Fichero[]>(this.DIRECCION_API + "/todos/" + usuario);
    }

    public moverFichero(noEnvia: number, noRecibe: number) : Observable <any> {
        return this.httpClient.get<any>(this.DIRECCION_API + "/mover/" + noEnvia + "/" + noRecibe);
    }

    public marcarFicheroInactivo(numero: number) : Observable <any> {
        return this.httpClient.delete<any>(this.DIRECCION_API + "/" + numero);
    }
}