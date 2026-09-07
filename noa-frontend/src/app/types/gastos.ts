export interface Gasto{
    id?: number,
    fecha: string,
    categoria: string,
    concepto: string,
    importe: number,
    tipo: 'gasto' | 'ingreso';
}