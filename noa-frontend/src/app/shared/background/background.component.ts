import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuHambComponent } from "../menu-hamb/menu-hamb.component";
import { ModalManager } from '../utils/modal-manager';
import { ProfileComponent } from "../profile/profile.component"; 

@Component({
  selector: 'app-background',
  imports: [RouterLink, CommonModule, MenuHambComponent, ProfileComponent],
  templateUrl: './background.component.html',
  styleUrl: './background.component.css'
})
export class BackgroundComponent {
  
  private cdr = inject(ChangeDetectorRef);
  public modalMenu = new ModalManager(this.cdr);
  public modalPerfil = new ModalManager(this.cdr);
}
