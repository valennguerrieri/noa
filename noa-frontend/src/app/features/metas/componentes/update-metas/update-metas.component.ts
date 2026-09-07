import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MetasService } from '../../../../service/metas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Meta } from '../../../../types/metas';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-metas',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-metas.component.html',
  styleUrl: './update-metas.component.css'
})
export class UpdateMetasComponent implements OnInit{

  private metasService = inject(MetasService);
  private route = inject(Router);
  private toastr = inject(ToastrService); 

  private fb = inject(FormBuilder);
  activatedRoute = inject(ActivatedRoute);

  id: number = 0;

  fechaMinima = new Date().toLocaleDateString('en-CA');

  form = this.fb.group({
    id: [{ value: this.id, disabled: true }],
    tipo: ['', [Validators.required]],
    titulo: ['', [Validators.required, Validators.maxLength(50)]],
    fechaEstipulada: ['', [Validators.required]],
    completado: [0 ,[Validators.required]]
  });

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        const idString = params.get('id') ?? '' ;
        if(idString){
          this.id = Number(idString);
          this.getMetaPorId(this.id); 
        }
      }, error: (e: Error) => {
        console.log(e.message);
      }
    })
  }

  async getMetaPorId(id: number){
    const meta = await this.metasService.getMetaPorId(id);
    if(meta){
      this.form.controls['id'].setValue(meta.id!);
      this.form.controls['tipo'].setValue(meta.tipo);
      this.form.controls['titulo'].setValue(meta.titulo);
      this.form.controls['fechaEstipulada'].setValue(meta.fechaEstipulada);
      this.form.controls['completado'].setValue(meta.completado);
    }
  }

  async update(){
    if(this.form.invalid) return;
    const datosMeta = this.form.getRawValue() as Meta; 

    const metaActualizada: Meta = {
      ...datosMeta,
      id: this.id
    };
    // console.log(metaActualizada);
    try{
      await this.metasService.updateMeta(metaActualizada);
      this.toastr.success('Meta modificada correctamente..', 'Meta');
      this.cerrar.emit();
      this.route.navigate(['/features/metas']) ;
    }catch(error){
      console.log(error);
    }
  }

  @Output() cerrar = new EventEmitter<void>();

  onCancelar(){
    this.cerrar.emit(); 
  }
}
