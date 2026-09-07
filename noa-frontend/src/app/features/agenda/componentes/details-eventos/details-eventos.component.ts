import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { BackgroundComponent } from '../../../../shared/background/background.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventosService } from '../../../../service/eventos.service';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '../../../../types/eventos';
import { ModalManager } from '../../../../shared/utils/modal-manager';
import { CommonModule, DatePipe } from '@angular/common';
import { UpdateEventosComponent } from "../update-eventos/update-eventos.component";

@Component({
  selector: 'app-details-eventos',
  imports: [BackgroundComponent, RouterLink, DatePipe, UpdateEventosComponent, CommonModule],
  templateUrl: './details-eventos.component.html',
  styleUrl: './details-eventos.component.css'
})
export class DetailsEventosComponent implements OnInit{

  private eventosService = inject(EventosService);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);
  public modalEvento = new ModalManager(this.cdr);

  evento: Evento = {
    id: 0,
    tipo: '',
    titulo: '',
    fecha: '',
    lugar: '',
    descripcion: ''
  }; 
  
  ngOnInit(): void {
    const idString = this.route.snapshot.paramMap.get('id');
    if(idString){
      const id = Number(idString);
      this.obtenerEvento(id); 
    }
  }

  async obtenerEvento(id: number){
    try {
      this.evento = await this.eventosService.getEventoPorId(id);
    } catch (error) {
      console.log(error);
    }
  }

  async eliminarEvento(id: number){
    try {
      await this.eventosService.deleteEvento(id);
      this.toastr.warning('Evento eliminado correctamente..', 'Evento');
    } catch (error) {
      console.log(error);
    }
  }

}
