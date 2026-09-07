import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, Input, OnInit } from '@angular/core';
import { GastosService } from '../../../../service/gastos.service';
import { ModalManager } from '../../../../shared/utils/modal-manager';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-list-gastos',
  imports: [CommonModule, RouterLink, BaseChartDirective],
  templateUrl: './list-gastos.component.html',
  styleUrl: './list-gastos.component.css'
})
export class ListGastosComponent implements OnInit{

  public gastosService = inject(GastosService);
  private cdr = inject(ChangeDetectorRef);
  public modalGasto = new ModalManager(this.cdr);

  constructor(){
    effect(() => {
      const cambios = this.gastosService.gastos();
      this.cargarMovimientosDelMes();
      this.actualizarGraficos();
    })
  }

  fechaActual: Date = new Date();
  gastos = this.gastosService.gastos;

  ngOnInit(): void {
    this.gastosService.getGastos();
  }

  filtro: string = 'todos';

  @Input() set tipoFiltro(valor: string) {
    this.filtro = valor; 
    this.gastosService.cambiarFiltro(valor);
  }

  movimientosFiltrados: any[] = [];

  cargarMovimientosDelMes(){
    const fechaBuscada = this.fechaActual.toISOString().slice(0, 7);
    const gastosLista = this.gastosService.gastos();

    this.movimientosFiltrados = gastosLista.filter(gasto => {
      const coincideFecha = gasto.fecha.startsWith(fechaBuscada);
      const coincideTipo = this.filtro === 'todos' || gasto.tipo === this.filtro;
      return coincideFecha && coincideTipo;
    })
    .sort((a, b) => {
      return b.fecha.localeCompare(a.fecha);
    })
  }

  cambiarMes(mov: number){
    const nuevaFecha = new Date(this.fechaActual);
    nuevaFecha.setMonth(nuevaFecha.getMonth() + mov);
    this.fechaActual = nuevaFecha;
    this.cargarMovimientosDelMes();
    this.actualizarGraficos();
  }

  // Gráficos de referencia de gastos e ingresos mensuales

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  public chartDataGastos: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }]
  };

  public chartDataIngresos: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }]
  };

  actualizarGraficos() {
    const todosLosMovimientos = this.gastosService.gastos();
    const fechaBuscada = this.fechaActual.toISOString().slice(0, 7);

    const movimientosDelMes = todosLosMovimientos.filter(m => 
      m.fecha.startsWith(fechaBuscada)
    );

    const soloGastos = movimientosDelMes.filter(g => g.tipo === 'gasto');
    const soloIngresos = movimientosDelMes.filter(g => g.tipo === 'ingreso');
    
    const gastosPorCategoria = new Map<string, number>();
    soloGastos.forEach(g => {
      const actual = gastosPorCategoria.get(g.categoria) || 0;
      gastosPorCategoria.set(g.categoria, actual + g.importe); //Sumamos x categoría
    });

    const ingresosPorCategoria = new Map<string, number>();
    soloIngresos.forEach(i => {
      const actual = ingresosPorCategoria.get(i.categoria) || 0;
      ingresosPorCategoria.set(i.categoria, actual + i.importe);
    });

    const coloresMap: any = {
      // Colores para categorías de gastos
      'Comida': '#ff9100', 'Transporte': '#2979ff', 'Servicios': '#fffb00', 
      'Salud': '#ff4444', 'Ocio': '#00bfa5', 'Ropa': '#f06292', 'Otros': '#643c06',
      
      // Colores para categorías de ingresos
      'Sueldo': '#245826', 'Ventas': '#0d0247', 'Regalos': '#f06292',
      'Inversiones': '#7e57c2'
    };

    this.chartDataGastos = {
      labels: Array.from(gastosPorCategoria.keys()),
      datasets: [{
        data: Array.from(gastosPorCategoria.values()),
        backgroundColor: Array.from(gastosPorCategoria.keys()).map(cat => coloresMap[cat] || '#949494'), // Colores según categoría
        borderWidth: 0,
        hoverOffset: 4
      }]
    };

    this.chartDataIngresos = {
      labels: Array.from(ingresosPorCategoria.keys()),
      datasets: [{
        data: Array.from(ingresosPorCategoria.values()),
        backgroundColor: Array.from(ingresosPorCategoria.keys()).map(cat => coloresMap[cat] || '#949494'),
        borderWidth: 0,
        hoverOffset: 4
      }]
    };
  }

  sumarMontos(): number{
    return this.movimientosFiltrados.reduce((total, item) => total + item.importe, 0);
  }

}