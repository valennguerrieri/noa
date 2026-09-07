import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Nota } from '../../../../types/notas';
import { NotasService } from '../../../../service/notas.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BackgroundComponent } from '../../../../shared/background/background.component';
import { ToastrService } from 'ngx-toastr';
import { UpdateNotasComponent } from "../update-notas/update-notas.component";
import { CommonModule } from '@angular/common';
import { ModalManager } from '../../../../shared/utils/modal-manager';

@Component({
  selector: 'app-details-notas',
  imports: [BackgroundComponent, RouterLink, UpdateNotasComponent, CommonModule],
  templateUrl: './details-notas.component.html',
  styleUrl: './details-notas.component.css'
})
export class DetailsNotasComponent implements OnInit{

  nota: Nota = {
    id: 0,
    fecha: '',
    titulo: '',
    descripcion: '',
    color: ''
  }; 

  constructor(private notasService: NotasService, private route: ActivatedRoute, private toastr: ToastrService){}

  ngOnInit(): void {
    const idString = this.route.snapshot.paramMap.get('id') ;
    if(idString){
      const id = Number(idString);
      this.obtenerNota(id);
    }
  }

  async obtenerNota(id: number){
    try{
      this.nota = await this.notasService.getNotaPorId(id);
    }catch(error){
      console.log(error);
    }
  }

  async eliminarNota(id: number){
    try{
      await this.notasService.deleteNota(id);
      this.toastr.warning('Nota eliminada correctamente..', 'Nota');
    }catch(error){
      console.log(error);
    }
  }

  //Para abrir o cerrar el modal 
  private cdr = inject(ChangeDetectorRef);
  public modalNota = new ModalManager(this.cdr);

}

//   obtenerNota(id: string){
//     this.notasService.getNotaPorId(id).subscribe({
//       next:(data) => {
//         this.nota = data; 
//       },
//       error:(error) => {
//         console.error(error); 
//       }
//     })
//   }