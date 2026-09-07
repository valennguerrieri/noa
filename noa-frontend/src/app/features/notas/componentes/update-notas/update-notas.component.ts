import { Component, inject, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotasService } from '../../../../service/notas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Nota } from '../../../../types/notas';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-notas',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-notas.component.html',
  styleUrl: './update-notas.component.css'
})
export class UpdateNotasComponent implements OnInit{
  
  private fb = inject(FormBuilder) ;
  activatedRoute = inject(ActivatedRoute);

  // @Input() idNota!: Nota ;

  constructor(private notasService: NotasService, private route: Router, private toastr: ToastrService){}

  coloresPaleta: string[] = [
    '#c9d8ee', //Por defecto
    '#e7e3a1',
    '#c1e9ad',
    '#eda6f3ff',
    '#f3a4a4ff',
    '#979797ff'
  ];

  form = this.fb.group({
    fecha: [{ value:'', disabled: true }],
    titulo: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    color: [this.coloresPaleta[0], [Validators.required]]
  });

  id: number = 0;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        // console.log(params.get('id'));
        const idString = params.get('id') ?? '';
        if(idString){
            this.id = Number(idString);
            this.getNotaPorId(this.id) ; 
        }
      },
      error: (e: Error) => {
        console.log(e.message);
      }
    })
  }

  async getNotaPorId(id: number){
    const nota = await this.notasService.getNotaPorId(id);
    if(nota){
        const fechaFormateada = nota.fecha ? String(nota.fecha) : ''; 
        
        this.form.controls['fecha'].setValue(fechaFormateada);
        this.form.controls['titulo'].setValue(nota.titulo);
        this.form.controls['descripcion'].setValue(nota.descripcion);
        this.form.controls['color'].setValue(nota.color ?? this.coloresPaleta[0]);
    }
  }

  async update(){
    if(this.form.invalid) return;
    const datosNota = this.form.getRawValue() as Nota;

    const notaActualizada: Nota = {
      ...datosNota, 
      id: this.id
    };

    try{
      await this.notasService.updateNota(notaActualizada); 
      this.toastr.success('Nota modificada correctamente..', 'Nota');
      this.cerrar.emit();
      this.route.navigate(['/features/notas']) ;
    }catch(error){
      console.log(error);
    }
  }


//   update(){
//     if(this.form.invalid) return;
//     const nota = this.form.getRawValue() as Nota;

//     this.notasService.updateNota(nota, this.id).subscribe({
//       next:(response) => {
//         this.toastr.success('Nota modificada correctamente..', 'Nota');
//         this.cerrar.emit();
//         this.route.navigate(['/features/notas']) ;
//       },
//       error: (error) => {
//         console.error(error) ; 
//       }
//     });
//   }

  @Output() cerrar = new EventEmitter<void>();

  onCancelar(){
    this.cerrar.emit(); 
  }

}

//   getNotaPorId(id: string | null){
//     this.notasService.getNotaPorId(id).subscribe({
//       next: (nota: Nota) => {
//         const fechaFormateada = nota.fecha ? String(nota.fecha) : ''; 
        
//         // this.form.controls['id'].setValue(nota.id);
//         this.form.controls['fecha'].setValue(fechaFormateada);
//         this.form.controls['titulo'].setValue(nota.titulo);
//         this.form.controls['descripcion'].setValue(nota.descripcion);
//         this.form.controls['color'].setValue(nota.color ?? this.coloresPaleta[0]);
//       },
//       error:(error) => {
//         console.error(error); 
//       }
//     })
//   }