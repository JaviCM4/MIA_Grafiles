import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Archivo } from "../models/Archivo";

@Injectable({providedIn: "root"})
export class ArchivoService {

    readonly DIRECCION_API= "http://localhost:8080/archivos";
    
    constructor(private httpClient: HttpClient) {}

    public crearArchivo(archivo: Archivo) : Observable<any> {
        return this.httpClient.post<any>(this.DIRECCION_API, archivo);
    }

    public actualizarArchivo(archivo: Archivo) : Observable<any> {
        return this.httpClient.put<any>(this.DIRECCION_API, archivo);
    }

    public obtenerArchivos(usuario: string, path: string) : Observable <Archivo[]> {
        return this.httpClient.get<Archivo[]>(this.DIRECCION_API + "/" + usuario + "/" + path);
    }

    public obtenerArchivosInactivos(usuario: string) : Observable <Archivo[]> {
        return this.httpClient.get<Archivo[]>(this.DIRECCION_API + "/inactivos/" + usuario);
    }

    public moverArchivo(noEnvia: number, noRecibe: number) : Observable <any> {
        return this.httpClient.get<any>(this.DIRECCION_API + "/mover/" + noEnvia + "/" + noRecibe);
    }

    public marcarArchivoInactivo(numero: number): Observable <any> {
        return this.httpClient.delete<any>(this.DIRECCION_API + "/" + numero);
    }

    /* Prueba */
    public enviarImagen(file: File) : Observable <any> {
        const formData = new FormData();
        formData.append('image', file);

        return this.httpClient.post<any>(this.DIRECCION_API + "/subir", formData);
    }

    public obtenerImagen(filename: string): Observable<Blob> {
        return this.httpClient.get<Blob>(`${this.DIRECCION_API}/imagen/${filename}`, { responseType: 'blob' as 'json' });
    } 
    
    public copiarArchivoExistente(numero: number) : Observable <any> {
        return this.httpClient.get<any>(this.DIRECCION_API + "/copiar/" + numero);
    }

}