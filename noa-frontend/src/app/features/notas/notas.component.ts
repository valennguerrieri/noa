import { inject, ChangeDetectorRef, Component } from '@angular/core';
import { BackgroundComponent } from '../../shared/background/background.component';
import { AddNotasComponent } from "./componentes/add-notas/add-notas.component";
import { CommonModule } from '@angular/common';
import { ListNotasComponent } from "./componentes/list-notas/list-notas.component";
import { ModalManager } from '../../shared/utils/modal-manager';

@Component({
  selector: 'app-notas',
  imports: [BackgroundComponent, AddNotasComponent, CommonModule, ListNotasComponent],
  templateUrl: './notas.component.html',
  styleUrl: './notas.component.css'
})
export class NotasComponent {

  //Para abrir o cerrar el modal 
  private cdr = inject(ChangeDetectorRef);
  public modalNota = new ModalManager(this.cdr);

  public numColumnas = 2; 

  cambiarColumnas(event: Event){
    const selectElement = event.target as HTMLSelectElement;
    this.numColumnas = Number(selectElement.value)

    this.cdr.detectChanges();
  }

}
