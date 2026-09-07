import { ChangeDetectorRef } from '@angular/core';

export class ModalManager {
    
    constructor(private cdr?: ChangeDetectorRef) {}

    public mostrarFormulario = false;

    abrirFormulario() {
        this.mostrarFormulario = true;
        this.cdr?.detectChanges(); 
    }

    cerrarFormulario() {
        this.mostrarFormulario = false;
        this.cdr?.detectChanges();
    }

    //Para listado x día 

    public mostrarEventos = false; 
    public diaSeleccionado: any = null; 

    abrirModalEventos(dia: any){
        this.diaSeleccionado = dia;
        this.mostrarEventos = true;
    }

    cerrarModalEventos(){
        this.mostrarEventos = false;
        this.diaSeleccionado = null;
    }

}