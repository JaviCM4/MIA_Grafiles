import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Compartido } from "../models/Compartido";

@Injectable({providedIn: "root"})
export class CompartidoService {

    readonly DIRECCION_API= "http://localhost:8080/compartidos";
    
    constructor(private httpClient: HttpClient) {}

    public crearCompartido(compartido: Compartido) : Observable <any> {
        return this.httpClient.post<any>(this.DIRECCION_API, compartido);
    }

    public obtenerMisArchivosCompartidos(usuario: string) : Observable<Compartido[]> {
        return this.httpClient.get<Compartido[]>(this.DIRECCION_API + "/lista/" + usuario);
    }

    public eliminarArchivoCompartido(no: number) : Observable <any> {
        return this.httpClient.delete<any>(this.DIRECCION_API + "/" + no);
    }
}