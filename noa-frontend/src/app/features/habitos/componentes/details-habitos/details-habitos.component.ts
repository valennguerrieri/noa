import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts'; 
import { ChartConfiguration, ChartData } from 'chart.js';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HabitosService } from '../../../../service/habitos.service';
import { BackgroundComponent } from '../../../../shared/background/background.component';
import { ToastrService } from 'ngx-toastr';
import { ModalManager } from '../../../../shared/utils/modal-manager';
import { UpdateHabitosComponent } from "../update-habitos/update-habitos.component";

@Component({
  selector: 'app-details-habitos',
  imports: [BackgroundComponent, RouterLink, CommonModule, BaseChartDirective, UpdateHabitosComponent],
  templateUrl: './details-habitos.component.html',
  styleUrl: './details-habitos.component.css'
})
export class DetailsHabitosComponent {

  private route = inject(ActivatedRoute);
  private habitosService = inject(HabitosService);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);
  public modalHabito = new ModalManager(this.cdr);

  habito: any = null;
  porcentajeCompletado: number = 0;
  porcentajeFallido: number = 0;

  //Etiquetas
  public chartLabels: string[] = ['Completado', 'Fallido', 'Restante'];

  //Datos iniciales
  public chartData: ChartData<'doughnut'> = {
    labels: this.chartLabels,
    datasets: [{ 
      data: [0, 0, 1], 
      backgroundColor: ['#006625', '#d32424', '#e7e5e5'],
      hoverBackgroundColor: ['#012c11', '#811616', 'rgb(145, 143, 143)'],
      borderWidth: 0
    }]
  };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  ngOnInit(): void {
    const idString = this.route.snapshot.paramMap.get('id');

    if (idString) {
      const id = Number(idString);
      this.obtenerHabito(id);
    }
  }

  async obtenerHabito(id: number){
    try {
      this.habito = await this.habitosService.getHabitoPorId(id);
      this.calcularEstadistica();
    } catch (error) {
      console.log(error);
    }
  }

  calcularEstadistica(){
    if (!this.habito) return;
    const valores = Object.values(this.habito.diasCompletados || {}); //diasCompletados es objeto

    //Cuántos hay de c/u
    const verdes = valores.filter(val => val === 'completado').length;
    const rojos = valores.filter(val => val === 'fallido').length;

    const fechaHabito = new Date(this.habito.fecha + 'T00:00:00'); 
    const diasTotalesMes = new Date(fechaHabito.getFullYear(), fechaHabito.getMonth() + 1, 0).getDate();
    // console.log(fechaHabito);
    const pendientes = diasTotalesMes - (verdes + rojos);

    this.porcentajeCompletado = Math.round((verdes / diasTotalesMes) * 100);
    this.porcentajeFallido = Math.round((rojos / diasTotalesMes) * 100);

    this.chartData = {
      labels: this.chartLabels,
      datasets: [{
        data: [verdes, rojos, pendientes],
        backgroundColor: ['#006625', '#d32424', '#e7e5e5'],
        hoverBackgroundColor: ['#012c11', '#811616', 'rgb(145, 143, 143)'],
        borderWidth: 0
      }]
    };
  }

  async eliminarHabito(id:number){
    try {
      await this.habitosService.deleteHabito(id);
      this.toastr.warning('Hábito eliminado correctamente..', 'Hábito');
    } catch (error) {
      console.log(error);
    }
  }

}
