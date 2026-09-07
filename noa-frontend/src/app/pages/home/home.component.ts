import { Component } from '@angular/core';
import { BackgroundComponent } from '../../shared/background/background.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [BackgroundComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
