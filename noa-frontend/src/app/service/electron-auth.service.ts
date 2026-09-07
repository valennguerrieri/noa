import { Injectable, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ElectronAuthService {

  constructor(private router: Router, private ngZone: NgZone, private supabaseService: SupabaseService) { }

  private readonly KEY_SESION = 'usuario_noa';

  async loginWithGoogle(): Promise<any>{
    if((window as any).electronAPI){
      try{
        const result = await (window as any).electronAPI.googleLogin(); //Llama al preload
        if(result.success){

          const { perfil, idToken } = result.data; 
          
          // Conexión con Supabase. Se pasa el token de Google
          const { data: supabaseData, error } = await this.supabaseService.client.auth.signInWithIdToken({
            provider: 'google',
            token: idToken,
          });

          if (error) {
            console.error('Error de Supabase:', error.message);
            throw new Error('No se pudo iniciar sesión en la nube');
          }

          return new Promise((resolve) => {
            this.ngZone.run(() => {
              this.guardarSesion(result.data);
              resolve(result.data);
            }); //Actualizar la vista de Ang con ngzone
          });
        }else{
          throw new Error(result.error);
        }
      }catch(error){ 
        throw error;
      }
    }else {
      const { data, error } = await this.supabaseService.client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/home'
        }
      });

      if (error) {
        console.error('Error en login web:', error.message);
        throw error;
      }
    }
  }
  
  //Memoria para guardar la sesión

  guardarSesion(usuario: any){
    localStorage.setItem(this.KEY_SESION, JSON.stringify(usuario));
  }

  obtenerUsuario(){
    const data = localStorage.getItem(this.KEY_SESION);
    return data ? JSON.parse(data) : null;
    // const usuarioDeSesion = data ? JSON.parse(data) : null;
    // if(!usuarioDeSesion){
    //   email = usuarioDeSesion.email
    // }
  }

  //Preguntar si hay alguien conectado
  estaLogueado(): boolean{
    return !!localStorage.getItem(this.KEY_SESION);
  }

  //Salir(Borrar todo)
  async cerrarSesion(){
    await this.supabaseService.client.auth.signOut();

    localStorage.removeItem(this.KEY_SESION);
    window.location.href = '/login';
  }

}