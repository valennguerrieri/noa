import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-anual',
  imports: [CommonModule],
  templateUrl: './anual.component.html',
  styleUrl: './anual.component.css'
})
export class AnualComponent {
  @Input() meses: any[] = [];
  @Output() mesClick = new EventEmitter<number>();
}
