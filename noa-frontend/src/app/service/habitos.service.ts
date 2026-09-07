import { inject, Injectable, signal } from '@angular/core';
import { Habito } from '../types/habitos';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class HabitosService {

    private supabaseService = inject(SupabaseService);
    constructor(){ }

    habitos = signal<Habito[]>([]);
    
    async addHabito(habito: Habito): Promise<Habito>{
        const { data } = await this.supabaseService.client
            .from('habitos').insert([habito]).select().single();
        this.habitos.update(listaActual => [...listaActual, data])
        return data; 
    }

    async updateHabito(habito: Habito): Promise<boolean>{
        const { error } = await this.supabaseService.client
            .from('habitos').update(habito).eq('id', habito.id);
        this.habitos.update(listaActual => listaActual.map(h => h.id === habito.id ? habito : h));
        return true; 
    }

    async deleteHabito(id: number): Promise<boolean>{
        const { error } = await this.supabaseService.client
            .from('habitos').delete().eq('id', id);
        this.habitos.update(listaActual => listaActual.filter(h => h.id !== id));
        return true; 
    }

    async getHabitos(){
        try{
            let query = this.supabaseService.client
                .from('habitos').select('*');
            const { data } = await query;
            this.habitos.set(data || []);
        }catch(error){
            console.log(error);
        }
    }

    async getHabitoPorId(id: number): Promise<Habito>{
        const { data } = await this.supabaseService.client
            .from('habitos').select('*').eq('id', id).single();
        return data;
    }
    
}