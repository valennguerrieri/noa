import { Component, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { EventosService } from '../../../../service/eventos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Evento } from '../../../../types/eventos';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-eventos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-eventos.component.html',
  styleUrl: './update-eventos.component.css'
})
export class UpdateEventosComponent implements OnInit{

  private eventosService = inject(EventosService);
  private route = inject(Router);
  private toastr = inject(ToastrService);

  private fb = inject(FormBuilder);
  activatedRoute = inject(ActivatedRoute);

  id: number = 0;

  tiposEvento: string[] = [
    'Estudio',
    'Personal',
    'Trabajo',
    'Salud',
    'Otro'
  ];

  form = this.fb.group({
    id: [{ value: this.id, disabled: true }],
    tipo: ['', [Validators.required]],
    titulo: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
    lugar: [''],
    descripcion: ['']
  });

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        const idString = params.get('id') ?? '' ;
        if(idString){
          this.id = Number(idString);
          this.getEventoPorId(this.id);
        }
      }, error: (e: Error) => {
        console.log(e.message);
      }
    })
  }


  async getEventoPorId(id: number){
    const evento = await this.eventosService.getEventoPorId(id);
    if(evento){
      this.form.controls['id'].setValue(evento.id!);
      this.form.controls['tipo'].setValue(evento.tipo);
      this.form.controls['titulo'].setValue(evento.titulo);
      this.form.controls['fecha'].setValue(evento.fecha);
      this.form.controls['lugar'].setValue(evento.lugar);
      this.form.controls['descripcion'].setValue(evento.descripcion!);
    }
  }

  async update(){
    if(this.form.invalid) return;
    const datosEvento = this.form.getRawValue() as Evento;

    const eventoActualizado: Evento = {
      ...datosEvento,
      id: this.id
    };

    try {
      await this.eventosService.updateEvento(eventoActualizado);
      this.toastr.success('Evento modificado correctamente..', 'Evento');
      this.cerrar.emit();
      this.route.navigate(['/features/agenda']);
    } catch (error) {
      console.log(error);
    }
  }

  @Output() cerrar = new EventEmitter<void>();

  onCancelar(){
    this.cerrar.emit(); 
  }

}
