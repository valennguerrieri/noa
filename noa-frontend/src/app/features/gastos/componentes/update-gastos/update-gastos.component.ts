import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GastosService } from '../../../../service/gastos.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Gasto } from '../../../../types/gastos';

@Component({
  selector: 'app-update-gastos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-gastos.component.html',
  styleUrl: './update-gastos.component.css'
})
export class UpdateGastosComponent implements OnInit{

  private gastosService = inject(GastosService);
  private route = inject(Router);
  private toastr = inject(ToastrService);

  private fb = inject(FormBuilder);
  activatedRoute = inject(ActivatedRoute);

  gastoOriginal: Gasto | null = null ;
  id: number = 0;

  categoriasGastos = ['Comida', 'Transporte', 'Servicios', 'Salud', 'Ocio', 'Ropa', 'Otros'];
  categoriasIngresos = ['Sueldo', 'Ventas', 'Regalos', 'Inversiones', 'Otros'];

  tipoSeleccionado: 'gasto' | 'ingreso' = 'gasto';

  form = this.fb.group({
    id: [{ value: this.id, disabled:true }],
    fecha: ['', [Validators.required]],
    categoria: ['', [Validators.required]],
    concepto: [''],
    importe: [0 , [Validators.required, Validators.min(0), Validators.max(10000000)]],
    tipo: ['gasto' as 'gasto'|'ingreso']
  })

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        const idString = params.get('id') ?? '' ;
        if(idString){
          this.id = Number(idString);
          this.getMovimientoPorId(this.id);
        }
      }, error: (e: Error) => {
        console.log(e.message);
      }
    })
  }

  cambiarTipo(valor: string){
    const tipo = valor as 'gasto' | 'ingreso';
    if(this.tipoSeleccionado === tipo) return; 
    this.tipoSeleccionado = tipo;
    
    const lista = tipo === 'gasto' ? this.categoriasGastos[0] : this.categoriasIngresos[0];
    this.form.patchValue({ 
      tipo: tipo,
      categoria: lista[0]
    });
  }

  async getMovimientoPorId(id:number){
    const movimiento = await this.gastosService.getGastoPorId(id);
    if(movimiento){
      this.tipoSeleccionado = movimiento.tipo;
      
      this.gastoOriginal = movimiento;
      this.form.controls['id'].setValue(movimiento.id!);
      this.form.controls['fecha'].setValue(movimiento.fecha);
      this.form.controls['categoria'].setValue(movimiento.categoria);
      this.form.controls['concepto'].setValue(movimiento.concepto);
      this.form.controls['importe'].setValue(movimiento.importe);
      this.form.controls['tipo'].setValue(movimiento.tipo);
    }
  }

  get categoriasMostradas(): string[] {
    if (this.tipoSeleccionado === 'gasto') {
      return this.categoriasGastos;
    } else {
      return this.categoriasIngresos;
    }
  }

  async update(){
    if(this.form.invalid) return; 

    const datosMovimiento = this.form.getRawValue() as Gasto;
    const movActualizado: Gasto = {
      ...datosMovimiento,
      id: this.id
    };

    try {
      await this.gastosService.updateGasto(movActualizado);
      this.toastr.success('Movimiento modificado correctamente..', 'Movimiento');
      this.cerrar.emit();
      this.route.navigate(['/features/gastos']);
    } catch (error) {
      console.log(error);
    }
  }

  @Output() cerrar = new EventEmitter<void>();

  onCancelar(){
    this.cerrar.emit(); 
  }
}
