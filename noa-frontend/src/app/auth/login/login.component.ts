import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ElectronAuthService } from '../../service/electron-auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent{

  constructor(private router: Router, private authService: ElectronAuthService,){}

  errorMessage = '';

  async iniciarSesion(){
    this.errorMessage = '';
    try {
      console.log("Intentando conectar con Electron...");
      const data = await this.authService.loginWithGoogle(); //loginWithGoogle() --> func. del servicio
      
      console.log('INFO: ',data);

      if(data){ 
        this.authService.guardarSesion(data);
        this.router.navigate(['home']); //Logro entrar, redirecciona al home
      }
    }catch(error: any){
      console.error("Falló el login:", error);
    }
  }

}
