import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { diaCalendario } from '../../../../types/diaCalendario';
import { Evento } from '../../../../types/eventos';
import { CalendarManager } from '../../../../shared/utils/calendar-manager';
import { CommonModule } from '@angular/common';
import { error } from 'console';
import { MensualComponent } from './vistas/mensual/mensual.component';
import { SemanalComponent } from './vistas/semanal/semanal.component';
import { AnualComponent } from './vistas/anual/anual.component';

@Component({
  selector: 'app-calendario-eventos',
  imports: [CommonModule, MensualComponent, SemanalComponent, AnualComponent],
  templateUrl: './calendario-eventos.component.html',
  styleUrl: './calendario-eventos.component.css'
})
export class CalendarioEventosComponent implements OnChanges{

  //Adaptado de: https://github.com/WingsBRStudio/javascripts/tree/main/Calendar-with-Events
  @Input() eventos: Evento[] = []; 

  fechaActual: Date = new Date(); 
  diaSeleccionado: Date | null = null; 

  @Input() vistaSeleccionada: string = 'Mensual';

  dias: diaCalendario[] = []; 
  eventosDelDiaSeleccionado: Evento[] = [];

  diasSemana: diaCalendario[] = [];
  mesesAnio: any[] = [] ; 

  nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.vistaSeleccionada);
    if(changes['eventos']){
      this.actualizarCalendario();
      if(this.diaSeleccionado){
        const diaRefresh = this.dias.find(d => d.fecha.toDateString() === this.diaSeleccionado?.toDateString());
        if(diaRefresh){
          this.seleccionarDia(diaRefresh);
        }
      }
    }
    if(changes['vistaSeleccionada']){
      this.actualizarCalendario();
    }
  }

  setVista(vista: string){
    this.vistaSeleccionada = vista; 
    this.actualizarCalendario();
  }

  actualizarCalendario(){
    this.eventosDelDiaSeleccionado = []; 
    // console.log('ActualizarCalendario():  ', this.vistaSeleccionada);
    switch(this.vistaSeleccionada){
      case 'Mensual':
        this.dias = CalendarManager.generarCalendario(this.fechaActual, (fecha, esMesActual) => {
          return CalendarManager.crearDia(fecha, esMesActual, this.eventos)});  
        break;

      case 'Semanal':
        this.dias = CalendarManager.generarSemana(this.fechaActual, this.eventos) ;
        break;

      case 'Anual':
        this.generarVistaAnual();
        break;

      default:
        console.log('Error');
    }
     
  }

  generarVistaAnual(){
    const anio = this.fechaActual.getFullYear();
    this.mesesAnio = []; 

    for(let i=0; i < 12; i++){
      const fechaMes = new Date(anio, i, 1) ;
      this.mesesAnio.push({
        nombre: this.nombresMeses[i],
        numeroMes: i,
        dias: CalendarManager.generarCalendario(fechaMes, (fecha, esMesActual) => {
          return CalendarManager.crearDia(fecha, esMesActual, this.eventos);
        })
      });
    }
  }

  //Navegación para días, meses

  cambiarMes(mov: number){
    const nuevaFecha = new Date(this.fechaActual);

    switch(this.vistaSeleccionada){
      case 'Mensual':
        nuevaFecha.setMonth(nuevaFecha.getMonth() +  mov);
        nuevaFecha.setDate(1); //Día 1
        break;

      case 'Semanal':
        nuevaFecha.setDate(nuevaFecha.getDate() + (mov * 7));
        break;

      case 'Anual':
        nuevaFecha.setFullYear(nuevaFecha.getFullYear() + mov); 
        break;

      default: 
        console.log('Error');
    }

    this.fechaActual = nuevaFecha;
    this.actualizarCalendario();

    this.diaSeleccionado = null;
    this.eventosDelDiaSeleccionado = [];
  }

  seleccionarDia(dia: diaCalendario){
    this.diaSeleccionado = dia.fecha;
    this.eventosDelDiaSeleccionado = dia.eventos;
  }
  
  irAHoy(){
    this.fechaActual = new Date();
    this.actualizarCalendario();

    const hoy = this.dias.find(d => d.esHoy);
    if(hoy){
      this.seleccionarDia(hoy);
    }
  }

  irAMes(mes: number){
    const fecha = new Date(this.fechaActual); 
    fecha.setMonth(mes);
    this.fechaActual = fecha;
    this.setVista('Mensual');
  }

}
