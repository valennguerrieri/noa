import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { HabitosService } from '../../../../service/habitos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Habito } from '../../../../types/habitos';

@Component({
  selector: 'app-update-habitos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-habitos.component.html',
  styleUrl: './update-habitos.component.css'
})
export class UpdateHabitosComponent implements OnInit{

  private habitosService = inject(HabitosService);
  private route = inject(Router);
  private toastr = inject(ToastrService);

  private fb = inject(FormBuilder);
  activatedRoute = inject(ActivatedRoute);

  habitoOriginal: Habito | null = null;
  id: number = 0; 

  form = this.fb.group({
    id:[{ value: this.id, disabled: true }],
    descripcion: ['', [Validators.required]],
    fecha:['', [Validators.required]]
  });

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        const idString = params.get('id') ?? '' ;
        if(idString){
          this.id = Number(idString);
          this.getHabitoPorId(this.id); 
        }
      }, error: (e: Error) => {
        console.log(e.message);
      }
    })
  }

  async getHabitoPorId(id: number){
    const habito = await this.habitosService.getHabitoPorId(id);
    if(habito){
      this.habitoOriginal = habito;
      this.form.controls['id'].setValue(habito.id!);
      this.form.controls['descripcion'].setValue(habito.descripcion);
      const fechaFormateada = habito.fecha.substring(0, 7);
      this.form.controls['fecha'].setValue(fechaFormateada);
    }
  }

  async update(){
    if(this.form.invalid) return;
    const datosHabito = this.form.getRawValue() as Habito;

    const fechaCompleta = datosHabito.fecha + '-01';

    const fechaOriginalCorta = this.habitoOriginal?.fecha.substring(0, 7);
    const huboCambioDeMes = datosHabito.fecha !== fechaOriginalCorta;

    const diasFinales = huboCambioDeMes ? {} : (this.habitoOriginal?.diasCompletados || {});

    const habitoActualizado: Habito = {
      id: this.id,
      descripcion: datosHabito.descripcion!,
      fecha: fechaCompleta,
      diasCompletados: diasFinales
    };
    
    try {
      await this.habitosService.updateHabito(habitoActualizado);
      if (huboCambioDeMes) {
        this.toastr.info('Al cambiar de mes, se reinició el progreso.', 'Aviso');
        this.toastr.success('Hábito modificado correctamente..', 'Hábito');
      } else {
        this.toastr.success('Hábito modificado correctamente..', 'Hábito');
      }
      this.cerrar.emit();
      this.route.navigate(['features/habitos']);
    } catch (error) {
      console.log(error);
    }
  }

  @Output() cerrar = new EventEmitter<void>();

  onCancelar(){
    this.cerrar.emit(); 
  }

}
