import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { BackgroundComponent } from '../../../../shared/background/background.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Meta } from '../../../../types/metas';
import { MetasService } from '../../../../service/metas.service';
import { ToastrService } from 'ngx-toastr';
import { ModalManager } from '../../../../shared/utils/modal-manager';
import { CommonModule } from '@angular/common';
import { UpdateMetasComponent } from "../update-metas/update-metas.component";

@Component({
  selector: 'app-details-metas',
  imports: [BackgroundComponent, RouterLink, CommonModule, UpdateMetasComponent],
  templateUrl: './details-metas.component.html',
  styleUrl: './details-metas.component.css'
})
export class DetailsMetasComponent implements OnInit{

  private metasService = inject(MetasService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService); 

  meta: Meta = {
    id: 0,
    tipo: '',
    titulo: '',
    fechaEstipulada: '',
    completado: 0
  }

  ngOnInit(): void {
    const idString = this.route.snapshot.paramMap.get('id') ;
    if(idString){
      const id = Number(idString);
      this.obtenerMeta(id);
    }
  }

  async obtenerMeta(id: number){
    try{
      this.meta = await this.metasService.getMetaPorId(id); 
    }catch(error){
      console.log(error);
    }
  }

  async eliminarMeta(id: number){
    try{
      await this.metasService.deleteMeta(id); 
      this.toastr.warning('Meta eliminada correctamente.. ', 'Meta');
    }catch(error){  
      console.log(error);
    }
  }

  async archivarMeta(id: number){
    const meta = await this.metasService.getMetaPorId(id);
    meta.completado = 2; //Archivado
    try{
      await this.metasService.updateMeta(meta); 
    }catch(error){
      console.log(error);
    }
  }

  async desarchivarMeta(id: number){
    const meta = await this.metasService.getMetaPorId(id);
    meta.completado = 1;
    this.cdr.detectChanges();
    try{
      await this.metasService.updateMeta(meta);
      this.router.navigate(['/features/metas']) ;
    }catch(error){
      console.log(error);
    }
  }

  private cdr = inject(ChangeDetectorRef);
  public modalMeta = new ModalManager(this.cdr);

}
