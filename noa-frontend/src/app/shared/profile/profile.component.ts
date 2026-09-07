import { Component, Input, Output, EventEmitter, inject, OnInit, signal } from '@angular/core';
import { ElectronAuthService } from '../../service/electron-auth.service';
import { SupabaseService } from '../../service/supabase.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  
  @Input() visible: boolean = false;
  @Output() cerrar = new EventEmitter<void>();

  private authService = inject(ElectronAuthService);
  private supabaseService = inject(SupabaseService);

  usuario = signal<any>(null);

  async ngOnInit() {
    const { data: {user} } = await this.supabaseService.client.auth.getUser(); //Info de la sesión actual

    if(user){
      this.usuario.set({
        nombre: user.user_metadata['full_name'],
        email: user.email,
        foto: user.user_metadata['avatar_url']
      });
    }
  }

  onCerrar() {
    this.cerrar.emit();
  }

  cerrarSesion() {
    this.onCerrar(); 
    this.authService.cerrarSesion();
  }
}
