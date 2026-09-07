import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { diaCalendario } from '../../../../../../types/diaCalendario';
import { ModalManager } from '../../../../../../shared/utils/modal-manager';
// import { ListEventosComponent } from '../../../list-eventos/list-eventos.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mensual',
  imports: [CommonModule, RouterLink],
  templateUrl: './mensual.component.html',
  styleUrl: './mensual.component.css'
})
export class MensualComponent {

  @Input() dias: diaCalendario[] = []; 
  @Output() diaClick = new EventEmitter<any>();

  private cdr = inject(ChangeDetectorRef);
  public modalEvento = new ModalManager(this.cdr);
}
