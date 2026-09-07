import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { BackgroundComponent } from '../../shared/background/background.component';
import { ModalManager } from '../../shared/utils/modal-manager';
import { CalendarioEventosComponent } from './componentes/calendario-eventos/calendario-eventos.component';
import { EventosService } from '../../service/eventos.service';
import { AddEventosComponent } from "./componentes/add-eventos/add-eventos.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { ListEventosComponent } from './componentes/list-eventos/list-eventos.component';

@Component({
  selector: 'app-agenda',
  imports: [BackgroundComponent, CalendarioEventosComponent, AddEventosComponent, CommonModule, FormsModule, CommonModule, ListEventosComponent],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css'
})
export class AgendaComponent implements OnInit{

  private cdr = inject(ChangeDetectorRef);
  public modalEvento = new ModalManager(this.cdr);

  eventosService = inject(EventosService);
  eventos = this.eventosService.eventos;

  ngOnInit(): void {
    this.eventosService.getEventos(); 
  }

  vistaSeleccionada: string = 'Mensual';
  listado: boolean = false;

  cambiarVista(event: any){
    this.vistaSeleccionada = event.target.value;
  }

  mostrarListado(){
    this.listado = !this.listado;
  }

  filtroSeleccionado: string = 'Todos';
  filtroTipos(event: any){
    this.filtroSeleccionado = event.target.value;
  }

  volverAlInicio(){
    this.filtroSeleccionado = 'Todos';
  }
}
