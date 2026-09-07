import { ChangeDetectorRef, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HabitosService } from '../../../../service/habitos.service';
import { CalendarManager } from '../../../../shared/utils/calendar-manager';
import { Habito } from '../../../../types/habitos';
import { ModalManager } from '../../../../shared/utils/modal-manager';

@Component({
  selector: 'app-list-habitos',
  imports: [RouterLink, CommonModule],
  templateUrl: './list-habitos.component.html',
  styleUrl: './list-habitos.component.css'
})
export class ListHabitosComponent implements OnInit{

  public habitosService = inject(HabitosService);
  private cdr = inject(ChangeDetectorRef);
  public modalHabito = new ModalManager(this.cdr);

  constructor(){
    effect(() => {
      const cambios = this.habitosService.habitos();
      this.cargarHabitosDelMes();
    });
  }

  fechaActual: Date = new Date();
  habitos =  this.habitosService.habitos;

  ngOnInit(): void {
    this.habitosService.getHabitos();
  }
  
  habitosFiltrados: any[] = [];

  cargarHabitosDelMes(){
    const fechaBuscada = this.fechaActual.toISOString().slice(0, 7); // YYYY-MM
    const habitosLista = this.habitosService.habitos();

    this.habitosFiltrados = habitosLista.filter(habito => {
      return habito.fecha.startsWith(fechaBuscada);
    })
    .map(habito => {
      const grilla = CalendarManager.generarCalendario(this.fechaActual, (f, esMesActual) => { 
        return CalendarManager.crearDiaHabito(f, esMesActual, habito.diasCompletados)
      });

      return { ...habito, grilla };
    });
  }

  cambiarMes(mov: number){
    const nuevaFecha = new Date(this.fechaActual);
    nuevaFecha.setMonth(nuevaFecha.getMonth() + mov);
    this.fechaActual = nuevaFecha; 
    this.cargarHabitosDelMes();
  }

  async estadoDia(habito: any, dia: any){
    if(dia.clase === 'externo') return;

    const numeroDia = dia.numero; 
    const copiaHabito = { ...(habito.diasCompletados || {}) };
    const estado = copiaHabito[numeroDia];

    if(!estado){
      copiaHabito[numeroDia] = 'completado';
    }else if(estado === 'completado'){
      copiaHabito[numeroDia] = 'fallido';
    }else{
      delete copiaHabito[numeroDia];
    }

    habito.diasCompletados = copiaHabito;

    habito.grilla = CalendarManager.generarCalendario(this.fechaActual, (f, esMesActual) => { 
      return CalendarManager.crearDiaHabito(f, esMesActual, habito.diasCompletados)
    });

    const habitoParaGuardar = { 
      ...habito, 
      diasCompletados: copiaHabito 
    };
    
    delete habitoParaGuardar.grilla; //La grilla sólo es visual

    try {
      await this.habitosService.updateHabito(habitoParaGuardar);
    } catch (error) {
      console.log(error);
    }
  }

}
