import { inject, Injectable, signal } from '@angular/core';
import { Meta } from '../types/metas';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class MetasService {

  private supabaseService = inject(SupabaseService);

  constructor() { }

  metas = signal<Meta[]>([]);

  async addMeta(meta: Meta): Promise<Meta> {
    const { data } = await this.supabaseService.client
      .from('metas').insert([meta]).select().single();
    this.metas.update(listaActual => [...listaActual, data]);
    return data;
  }

  async updateMeta(meta: Meta): Promise<boolean>{
    const { error } = await this.supabaseService.client
      .from('metas').update(meta).eq('id', meta.id);
    this.metas.update(listaActual => {
      if ((this.filtro === 'Archivada' && meta.completado !== 2) || (this.filtro !== 'Archivada' && meta.completado === 2)) {
        return listaActual.filter(m => m.id !== meta.id);
      }
      return listaActual.map(m => m.id === meta.id ? meta : m)
    });
    return true; 
  }
  
  async deleteMeta(id: number): Promise<boolean>{
    const { error } = await this.supabaseService.client
      .from('metas').delete().eq('id', id);
    this.metas.update(listaActual => listaActual.filter(m => m.id !== id));
    return true;
  }

  filtro: string = 'Todos';

  async getMetas(){
    try {
      let query = this.supabaseService.client.from('metas').select('*');
      if (this.filtro === 'Archivada') {
        console.log(this.filtro);
        query = query.eq('completado', 2); //'completado' = 2 significa archivada.
      } else {
        query = query.neq('completado', 2);
        if (this.filtro !== 'Todos') {
          query = query.eq('tipo', this.filtro);
        } 
      }
      const { data, error } = await query;

      if (error) throw error;
      
      this.metas.set(data || []);
      
    } catch (error) {
      console.error(error);
    }
  }

  async getMetaPorId(id: number): Promise<Meta>{
    const { data } = await this.supabaseService.client
      .from('metas').select('*').eq('id', id).single();
    return data;
  }

  async getMetaPorTipo(tipo: string): Promise<Meta[]>{
    const { data } = await this.supabaseService.client
      .from('metas').select('*').eq('tipo', tipo);
    return data || [];
  }

  cambiarFiltro(tipo: string){
    this.filtro = tipo; 
    this.getMetas();
  }

}
