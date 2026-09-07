import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Nota } from '../types/notas';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class NotasService {

  // private baseUrl = 'http://localhost:3000/notas' ;

  private supabaseService = inject(SupabaseService);
  notas = signal<Nota[]>([]);

  constructor() { }

  async addNota(nota: Nota): Promise<Nota>{
    const { data } = await this.supabaseService.client
      .from('notas').insert([nota]).select().single();
    this.notas.update(listaActual => [...listaActual, data]);
    return data; 
  }

  async updateNota(nota: Nota): Promise<boolean>{
    const { error } = await this.supabaseService.client
      .from('notas').update(nota).eq('id', nota.id);
    this.notas.update(listaActual => listaActual.map(n => n.id === nota.id ? nota : n));
    return true;
  }

  async deleteNota(id: number): Promise<boolean>{
    const { error } = await this.supabaseService.client
      .from('notas').delete().eq('id', id);
    this.notas.update(listaActual => listaActual.filter(n => n.id !== id));
    return true;
  }

  async getNotas(){
    try{
      const { data } = await this.supabaseService.client
        .from('notas').select('*');
      this.notas.set(data || []);
    }catch(error){
      console.log(error);
    }
  }

  async getNotaPorId(id: number): Promise<Nota>{
    const { data } = await this.supabaseService.client
      .from('notas').select('*').eq('id', id).single();
    return data;
  }
}
