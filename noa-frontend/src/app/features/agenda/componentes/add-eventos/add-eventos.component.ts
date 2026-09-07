import { Component, inject, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Evento } from '../../../../types/eventos';
import { EventosService } from '../../../../service/eventos.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-eventos',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-eventos.component.html',
  styleUrl: './add-eventos.component.css'
})
export class AddEventosComponent {

  constructor(private eventosService: EventosService, private route: Router, private toastr: ToastrService){ }

  private fb = inject(FormBuilder);

  tiposEvento: string[] = [
    'Estudio',
    'Personal',
    'Trabajo',
    'Salud',
    'Otro'
  ];

  fechaMinima = new Date().toLocaleDateString('en-CA') + 'T00:00';

  form = this.fb.group({
    tipo: ['', [Validators.required]],
    titulo: ['', [Validators.required, Validators.maxLength(50)]],
    fecha: ['', [Validators.required]],
    lugar: [''],
    descripcion: ['', [Validators.maxLength(50)]]
  });

  async onSubmit(){
    if(this.form.invalid) return;
    const evento = this.form.getRawValue() as Evento;

    const eventoParaGuardar: Evento = {
      tipo: evento.tipo,
      titulo: evento.titulo,
      fecha: evento.fecha,
      lugar: evento.lugar,
      descripcion: evento.descripcion
    };

    try{
      await this.eventosService.addEvento(eventoParaGuardar);
      this.toastr.success('Evento agregado correctamente..', 'Evento');
      this.cerrar.emit();
    }catch(error){
      console.log(error);
      this.toastr.error('No se pudo guardar el evento..', 'Evento');
    }
  }


  @Output() cerrar = new EventEmitter<void>();

  onCancelar(){
    this.cerrar.emit(); 
  }

}
