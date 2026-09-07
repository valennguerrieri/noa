import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { diaCalendario } from '../../../../../../types/diaCalendario';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-semanal',
  imports: [CommonModule, RouterLink],
  templateUrl: './semanal.component.html',
  styleUrl: './semanal.component.css'
})
export class SemanalComponent {
  @Input() dias: diaCalendario[] = []; 
  @Output() diaClick = new EventEmitter<any>();

  inicialDia: string[] = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
}
