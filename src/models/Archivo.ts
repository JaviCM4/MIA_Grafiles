export interface Archivo {
    no: number,
    usuario: string,
    padre: string,
    nombre: string,
    contenido: string,
    extension: string,
    activo: boolean,
    copiar: boolean,
    fecha: string
}