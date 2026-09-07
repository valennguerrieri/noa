import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { GastosService } from '../../../../service/gastos.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Gasto } from '../../../../types/gastos';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-gastos',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-gastos.component.html',
  styleUrl: './add-gastos.component.css'
})
export class AddGastosComponent {

  private gastosService = inject(GastosService);
  private route = inject(Router);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  private fb = inject(FormBuilder);

  pasoActual: 'seleccion' | 'formulario' = 'seleccion';

  hoy = new Date().toLocaleDateString('en-CA');
  tipoSeleccionado: 'gasto' | 'ingreso' = 'gasto';

  categoriasGastos = ['Comida', 'Transporte', 'Servicios', 'Salud', 'Ocio', 'Ropa', 'Otros'];
  categoriasIngresos = ['Sueldo', 'Ventas', 'Regalos', 'Inversiones', 'Otros'];

  elegirTipo(tipo: 'gasto' | 'ingreso', event?: Event){
    if (event) event.stopPropagation();
    
    this.tipoSeleccionado = tipo;
    this.pasoActual = 'formulario';
    if (tipo === 'gasto') {
      this.form.patchValue({ categoria: this.categoriasGastos[0] });
    } else {
      this.form.patchValue({ categoria: this.categoriasIngresos[0] });
    }
  }

  get categoriasMostradas(): string[] {
    if (this.tipoSeleccionado === 'gasto') {
      return this.categoriasGastos;
    } else {
      return this.categoriasIngresos;
    }
  }

  form = this.fb.group({
    fecha: [this.hoy, [Validators.required]],
    categoria: [this.categoriasGastos[0], [Validators.required]],
    concepto: [''],
    importe: [null , [Validators.required, Validators.min(0), Validators.max(10000000)]],
  });

  async onSubmit(){
    if(this.form.invalid) return;
    const gasto = this.form.getRawValue() ;

    const gastoParaGuardar: Gasto = {
      fecha: gasto.fecha!,
      categoria: gasto.categoria!,
      concepto: gasto.concepto!,
      importe: Number(gasto.importe),
      tipo: this.tipoSeleccionado
    };

    try {
      await this.gastosService.addGasto(gastoParaGuardar);
      this.toastr.success('Gasto agregado correctamente..', 'Gasto');
      this.cerrar.emit();
    } catch (error) {
      console.log(error);
      this.toastr.error('No se pudo guardar el gasto..', 'Error');
    }
  }

  @Output() cerrar = new EventEmitter<void>();

  onCancelar(){
    this.cerrar.emit(); 
  }
}
