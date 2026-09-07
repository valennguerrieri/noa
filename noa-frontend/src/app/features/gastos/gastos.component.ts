import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { BackgroundComponent } from '../../shared/background/background.component';
import { ModalManager } from '../../shared/utils/modal-manager';
import { AddGastosComponent } from "./componentes/add-gastos/add-gastos.component";
import { CommonModule } from '@angular/common';
import { ListGastosComponent } from "./componentes/list-gastos/list-gastos.component";

@Component({
  selector: 'app-gastos',
  imports: [CommonModule, BackgroundComponent, AddGastosComponent, ListGastosComponent],
  templateUrl: './gastos.component.html',
  styleUrl: './gastos.component.css'
})
export class GastosComponent {

  private cdr = inject(ChangeDetectorRef);
  public modalGasto = new ModalManager(this.cdr);

  filtroSeleccionado: string = 'todos';

  filtroTipos(event: any){
    this.filtroSeleccionado = event.target.value;
  }
}
