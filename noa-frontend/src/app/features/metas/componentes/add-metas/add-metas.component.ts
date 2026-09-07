import { Component, inject, Output, EventEmitter } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MetasService } from '../../../../service/metas.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { Meta } from '../../../../types/metas';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-add-metas',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './add-metas.component.html',
  styleUrl: './add-metas.component.css'
})
export class AddMetasComponent {
  
  private metasService = inject(MetasService);
  private route = inject(Router);
  private toastr = inject(ToastrService);

  private fb = inject(FormBuilder) ;
  
  tiposMeta: string[] = [
    'Estudio',
    'Personal',
    'Trabajo',
    'Otro..'
  ];

  fechaMinima = new Date().toLocaleDateString('en-CA');

  form = this.fb.group({
    tipo: ['', [Validators.required]],
    titulo: ['', [Validators.required, Validators.maxLength(50)]],
    fechaEstipulada: ['', [Validators.required]],
    completado: [0] 
  });

  async onSubmit(){
    if(this.form.invalid) return;
    const meta = this.form.getRawValue() as Meta;

    const metaParaGuardar: Meta = {
      tipo: meta.tipo,
      titulo: meta.titulo,
      fechaEstipulada: meta.fechaEstipulada,
      completado: meta.completado
    }

    try{
      await this.metasService.addMeta(metaParaGuardar);
      this.toastr.success('Meta agregada correctamente..', 'Meta');
      this.cerrar.emit();
    }catch(error){
      console.log(error);
      this.toastr.error('No se pudo guardar la meta..', 'Error');
    }
  }

  @Output() cerrar = new EventEmitter<void>();

  onCancelar(){
    this.cerrar.emit(); 
  }

}
