import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { BackgroundComponent } from '../../shared/background/background.component';
import { ModalManager } from '../../shared/utils/modal-manager';
import { CommonModule } from '@angular/common';
import { AddHabitosComponent } from "./componentes/add-habitos/add-habitos.component";
import { ListHabitosComponent } from "./componentes/list-habitos/list-habitos.component";

@Component({
  selector: 'app-habitos',
  imports: [BackgroundComponent, CommonModule, AddHabitosComponent, ListHabitosComponent],
  templateUrl: './habitos.component.html',
  styleUrl: './habitos.component.css'
})
export class HabitosComponent {

  private cdr = inject(ChangeDetectorRef);
  public modalHabito = new ModalManager(this.cdr);
}
