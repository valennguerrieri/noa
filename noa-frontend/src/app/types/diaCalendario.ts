import { Evento } from "./eventos";

export interface diaCalendario{
    fecha: Date,
    numero: number,
    esMesActual: boolean,
    esHoy: boolean,
    eventos: Evento[]; 
}