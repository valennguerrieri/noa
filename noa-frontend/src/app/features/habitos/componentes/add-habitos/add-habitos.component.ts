import { Component, EventEmitter, inject, Output } from '@angular/core';
import { HabitosService } from '../../../../service/habitos.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Habito } from '../../../../types/habitos';

@Component({
  selector: 'app-add-habitos',
  imports: [ReactiveFormsModule],
  templateUrl: './add-habitos.component.html',
  styleUrl: './add-habitos.component.css'
})
export class AddHabitosComponent {

  private habitosService = inject(HabitosService);
  private route = inject(Router);
  private toastr = inject(ToastrService); 

  private fb = inject(FormBuilder);
  fechaActual = new Date().toLocaleDateString('es-AR'); 

  form = this.fb.group({
    descripcion: ['', [Validators.required]],
    fecha: [new Date().toISOString().substring(0, 7), [Validators.required]],
    diasCompletados: ['']
  });

  async onSubmit(){
    if(this.form.invalid) return;
    const habito = this.form.getRawValue() as Habito;

    const fechaParaGuardar = habito.fecha + '-01';

    const habitoParaGuardar: Habito = {
      descripcion: habito.descripcion,
      fecha: fechaParaGuardar,
      diasCompletados: habito.diasCompletados
    };

    try {
      await this.habitosService.addHabito(habitoParaGuardar);
      this.toastr.success('Hábito guardado correctamente..', 'Hábito');
      this.cerrar.emit();
    } catch (error) {
      console.log(error);
      this.toastr.error('No se pudo guardar el hábito..', 'Error');
    }
  }

  @Output() cerrar = new EventEmitter<void>();

  onCancelar(){
    this.cerrar.emit(); 
  }

}
