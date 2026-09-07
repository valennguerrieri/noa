import { inject, Injectable, signal } from '@angular/core';
import { Gasto } from '../types/gastos';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class GastosService {

    private supabaseService = inject(SupabaseService);

    gastos = signal<Gasto[]>([]);

    async addGasto(gasto: Gasto): Promise<Gasto>{
        const { data } = await this.supabaseService.client
            .from('movimientos').insert([gasto]).select().single();
        this.gastos.update(listaActual => [...listaActual, data])
        return data;
    }

    async updateGasto(gasto: Gasto): Promise<boolean>{
        const { error } = await this.supabaseService.client
            .from('movimientos').update(gasto).eq('id', gasto.id);
        this.gastos.update(listaActual => listaActual.map(g => g.id === gasto.id ? gasto : g));
        return true;
    }

    async deleteGasto(id: number): Promise<boolean>{
        const { error } = await this.supabaseService.client
            .from('movimientos').delete().eq('id', id);
        this.gastos.update(listaActual => listaActual.filter(g => g.id !== id));
        return true; 
    }

    filtro: string = 'todos';

    async getGastos(){
        try {
            let query = this.supabaseService.client.from('movimientos').select('*');
            if(this.filtro !== 'todos'){
                query = query.eq('tipo', this.filtro)
            }

            const { data, error } = await query;
            if(error) throw error;

            this.gastos.set(data || []);
        } catch (error) {
            console.log(error);
        }
    }

    async getGastoPorId(id: number): Promise<Gasto>{
        const { data } = await this.supabaseService.client
            .from('movimientos').select('*').eq('id', id).single();
        return data;
    }

    async getGastosPorTipo(tipo: string): Promise<Gasto[]>{
        const { data } = await this.supabaseService.client
            .from('movimientos').select('*').eq('tipo', tipo);
        return data || [];
    }

    cambiarFiltro(tipo: string){
        this.filtro = tipo; 
        this.getGastos();
    }
}