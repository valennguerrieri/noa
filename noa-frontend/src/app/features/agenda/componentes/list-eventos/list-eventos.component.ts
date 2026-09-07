import { Component, inject, Input, OnInit, effect } from '@angular/core';
import { EventosService } from '../../../../service/eventos.service';
import { Evento } from '../../../../types/eventos';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-eventos',
  imports: [CommonModule, RouterLink],
  templateUrl: './list-eventos.component.html',
  styleUrl: './list-eventos.component.css'
})
export class ListEventosComponent implements OnInit{

  constructor(){
    effect(() => {
      const cambios = this.eventosService.eventos();
      this.cargarEventosDelMes();
    });
  }
  public eventosService = inject(EventosService);

  eventos: Evento[] = [];

  filtro: string = 'Todos'; 

  @Input() set tipoFiltro(valor: string){
    this.filtro = valor;
    this.cargarEventosDelMes();
  }

  ngOnInit(): void {
    this.cargarEventosDelMes();
  }

  fechaActual: Date = new Date();
  eventosFiltrados: Evento[] = [];

  cargarEventosDelMes(){
    const fechaBuscada = this.fechaActual.toISOString().slice(0, 7); // YYYY-MM
    const eventosLista = this.eventosService.eventos(); //Lee los datos que ya están en memoria

    this.eventosFiltrados = eventosLista.filter(evento => {

      const coincideFecha = evento.fecha.startsWith(fechaBuscada);
      const coincideTipo = this.filtro === 'Todos' || evento.tipo === this.filtro;
        
      return coincideFecha && coincideTipo;
    })
    .sort((a, b) => {
      return a.fecha.localeCompare(b.fecha);
    })
  }

  cambiarMes(mov: number){
    const nuevaFecha = new Date(this.fechaActual);
    nuevaFecha.setMonth(nuevaFecha.getMonth() + mov);
    this.fechaActual = nuevaFecha;
    this.cargarEventosDelMes();
  }

  irAEsteMes(){
    this.fechaActual = new Date();
    this.cargarEventosDelMes();
  }

}
