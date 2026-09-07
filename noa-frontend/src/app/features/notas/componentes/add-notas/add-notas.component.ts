import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NotasService } from '../../../../service/notas.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ToastrService } from 'ngx-toastr';

import { error } from 'console'; 
import { Nota } from '../../../../types/notas';

@Component({
  selector: 'app-add-notas',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './add-notas.component.html',
  styleUrl: './add-notas.component.css'
})
export class AddNotasComponent {

  private fb = inject(FormBuilder) ;

  constructor(private notasService: NotasService, private route: Router, private toastr: ToastrService){}

  fechaActual = new Date().toLocaleDateString('en-CA'); // yyyy-MM-dd 

  coloresPaleta: string[] = [
    '#c9d8ee', //Por defecto
    '#e7e3a1',
    '#c1e9ad',
    '#eda6f3ff',
    '#f3a4a4ff',
    '#979797ff'
  ]

  form = this.fb.group({
    fecha: [{ value: this.fechaActual, disabled: true }],
    titulo: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    color: [this.coloresPaleta[0], [Validators.required]]
  });

  async onSubmit(){
    if(this.form.invalid) return;
    const nota = this.form.getRawValue() as Nota;

    const notaParaGuardar: Nota = {
      // fecha: new Date().toISOString(),
      fecha: this.fechaActual,
      titulo: nota.titulo!,
      descripcion: nota.descripcion!,
      color: nota.color!
    }

    try{
      await this.notasService.addNota(notaParaGuardar);
      this.toastr.success('Nota agregada correctamente..', 'Nota');
      this.cerrar.emit();

    }catch(error){
      console.log(error);
      this.toastr.error('No se pudo guardar la nota..', 'Error');
    }
  }

  //Conexión entre dos componentes: notas y add-notas
  @Output() cerrar = new EventEmitter<void>();

  onCancelar(){
    this.cerrar.emit(); 
  }

}
