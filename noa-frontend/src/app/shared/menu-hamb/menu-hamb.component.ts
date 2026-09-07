import { Component, EventEmitter, Input, Output, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ElectronAuthService } from '../../service/electron-auth.service';
import { AddEventosComponent } from '../../features/agenda/componentes/add-eventos/add-eventos.component';
import { ModalManager } from '../utils/modal-manager';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-hamb',
  imports: [RouterLink, AddEventosComponent, CommonModule],
  templateUrl: './menu-hamb.component.html',
  styleUrl: './menu-hamb.component.css'
})
export class MenuHambComponent {

  @Input() visible: boolean = false; // Recibe el valor de modalMenu.mostrarFormulario
  @Output() cerrar = new EventEmitter<void>();

  private authService = inject(ElectronAuthService);

  onCerrar() {
    this.cerrar.emit();
  }

  cerrarSesion() {
    this.onCerrar(); 
    this.authService.cerrarSesion();
  }

  private cdr = inject(ChangeDetectorRef);
  public modalEvento = new ModalManager(this.cdr);
}
