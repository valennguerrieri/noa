import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotasService } from '../../../../service/notas.service';
import { Nota } from '../../../../types/notas';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-notas',
  imports: [RouterLink, CommonModule],
  templateUrl: './list-notas.component.html',
  styleUrl: './list-notas.component.css'
})
export class ListNotasComponent implements OnInit{

  notas: Nota[] = [] ;

  constructor(public notasService: NotasService, private toastr: ToastrService){ }

  ngOnInit(): void {
    // this.cargarNotas();
    this.notasService.getNotas();
  }

  // async cargarNotas(){
  //   try{
  //     this.notas = await this.notasService.getNotas();
  //   }catch(error){
  //     console.log(error);
  //   }
  // }

  async onEliminarDirecto(event: MouseEvent, id: number){
    event.stopPropagation();
    try{
      await this.notasService.deleteNota(id);
      this.toastr.warning('Nota eliminada correctamente..', 'Nota')
      // await this.cargarNotas();
    }catch(error){
      console.log(error);
    }
  }
}
