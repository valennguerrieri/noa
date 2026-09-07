import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { BackgroundComponent } from '../../../../shared/background/background.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GastosService } from '../../../../service/gastos.service';
import { Gasto } from '../../../../types/gastos';
import { ModalManager } from '../../../../shared/utils/modal-manager';
import { UpdateGastosComponent } from "../update-gastos/update-gastos.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details-gastos',
  imports: [BackgroundComponent, RouterLink, UpdateGastosComponent, CommonModule],
  templateUrl: './details-gastos.component.html',
  styleUrl: './details-gastos.component.css'
})
export class DetailsGastosComponent implements OnInit{
  
  private gastosService = inject(GastosService);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService); 
  private cdr = inject(ChangeDetectorRef);
  public modalMovimiento = new ModalManager(this.cdr);

  movimiento: Gasto = {
    id: 0,
    fecha: '',
    categoria: '',
    concepto: '',
    importe: 0,
    tipo: '' as any
  }

  ngOnInit(): void {
    const idString = this.route.snapshot.paramMap.get('id');
    if(idString){
      const id = Number(idString);
      this.obtenerMovimiento(id);
    }
  }

  async obtenerMovimiento(id: number){
    try {
      this.movimiento = await this.gastosService.getGastoPorId(id);
    } catch (error) {
      console.log(error);
    }
  }

  async eliminarMovimiento(id: number){
    try {
      await this.gastosService.deleteGasto(id);
      this.toastr.warning('Movimiento eliminado correctamente..', 'Movimiento');
    } catch (error) {
      console.log(error);
    }
  }

}
