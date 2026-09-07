export interface Habito{
    id?: number,
    descripcion: string,
    fecha: string,
    diasCompletados: Record<number, 'completado' | 'fallido'>;
}