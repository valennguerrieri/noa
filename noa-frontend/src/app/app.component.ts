import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ElectronAuthService } from './service/electron-auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  title = 'noa';

  constructor(private router: Router, private authService: ElectronAuthService) { }

  ngOnInit() {
    if (this.authService.estaLogueado()) {
        console.log("Usuario encontrado, yendo al home...");
        this.router.navigate(['/home']); 
    }
  }
}
