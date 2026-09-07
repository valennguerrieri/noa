import { inject, Injectable, signal } from "@angular/core";
import { Evento } from "../types/eventos";
import { SupabaseService } from "./supabase.service";

@Injectable({
  providedIn: 'root'
})
export class EventosService {

    private supabaseService = inject(SupabaseService);
    constructor(){ }

    eventos = signal<Evento[]>([]);

    async addEvento(evento: Evento): Promise<Evento>{
        const { data, error } = await this.supabaseService.client
            .from('eventos').insert([evento]).select().single();
        if(error){
            console.error('Error al añadir el evento:', error.message);
            throw error;
        }
        this.eventos.update(listaActual => [...listaActual, data])
        return data;
    }

    async updateEvento(evento: Evento): Promise<boolean>{
        const { error } = await this.supabaseService.client
            .from('eventos').update(evento).eq('id', evento.id);
        if(error){
            console.error('Error al actualizar el evento:', error.message);
            return false;
        }
        this.eventos.update(listaActual => listaActual.map(e => e.id === evento.id ? evento : e));
        return true;
    }

    async deleteEvento(id: number): Promise<boolean>{
        const { error } = await this.supabaseService.client
            .from('eventos').delete().eq('id', id);
        if(error){
            console.error('Error al borrar el evento:', error.message);
            return false;
        }
        this.eventos.update(listaActual => listaActual.filter(e => e.id !== id));
        return true;
    }
    
    filtro: string = 'Todos';

    async getEventos() {
        try {
        let query = this.supabaseService.client.from('eventos').select('*');

        if(this.filtro !== 'Todos'){
            query = query.eq('tipo', this.filtro); //Condición de consulta
        }
        const { data, error } = await query;
        if (error) throw error;

        this.eventos.set(data || []);
        } catch (error) {
        console.log(error);
        }
    }

    async getEventoPorId(id: number): Promise<Evento>{
        const { data, error } = await this.supabaseService.client
            .from('eventos').select('*').eq('id', id).single();
        if (error) throw error;
        return data; 
    }

    async getEventosPorTipo(tipo: string): Promise<Evento[]>{
        const { data, error } = await this.supabaseService.client
            .from('eventos').select('*').eq('tipo', tipo);
        if (error) throw error;
        return data || []; 
    }

}   