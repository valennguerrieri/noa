import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { BackgroundComponent } from '../../shared/background/background.component';
import { ModalManager } from '../../shared/utils/modal-manager';
import { CommonModule } from '@angular/common';
import { AddMetasComponent } from "./componentes/add-metas/add-metas.component";
import { ListMetasComponent } from "./componentes/list-metas/list-metas.component";

@Component({
  selector: 'app-metas',
  imports: [BackgroundComponent, CommonModule, AddMetasComponent, ListMetasComponent],
  templateUrl: './metas.component.html',
  styleUrl: './metas.component.css'
})
export class MetasComponent {

  private cdr = inject(ChangeDetectorRef);
  public modalMeta = new ModalManager(this.cdr);

  filtroSeleccionado: string = 'Todos';

  filtroTipos(event: any){
    this.filtroSeleccionado = event.target.value;
  }

  verArchivados(){
    this.filtroSeleccionado = 'Archivada';
  }

  volverAlInicio(){
    this.filtroSeleccionado = 'Todos';
  }
}
