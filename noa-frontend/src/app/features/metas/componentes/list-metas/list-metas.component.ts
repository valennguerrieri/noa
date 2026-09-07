import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MetasService } from '../../../../service/metas.service';
import { Meta } from '../../../../types/metas';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-metas',
  imports: [RouterLink, CommonModule],
  templateUrl: './list-metas.component.html',
  styleUrl: './list-metas.component.css'
})
export class ListMetasComponent{

  public metasService = inject(MetasService);

  metas: Meta[] = [] ;

  filtro: string = 'Todos';

  @Input() set tipoFiltro(valor: string) {
    this.filtro = valor; 
    this.metasService.cambiarFiltro(valor);
  }

  @Output() volverEvent = new EventEmitter<void>();

  async cambiarEstado(event: Event, meta: Meta){
    const estadoAct = meta.completado;

    //Para alternar entre 1 y 0
    meta.completado = 1 - meta.completado;
    event.stopPropagation();
    try{
      await this.metasService.updateMeta(meta)
    }catch(error){
      meta.completado = estadoAct;
      console.log(error);
    }
  }

}
