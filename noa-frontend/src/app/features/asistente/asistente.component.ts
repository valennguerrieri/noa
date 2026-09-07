import { Component, inject, OnInit, signal } from '@angular/core';
import { BackgroundComponent } from '../../shared/background/background.component';
import { AsistenteService } from '../../service/asistente.service';
import { NotasService } from '../../service/notas.service';
import { MetasService } from '../../service/metas.service';
import { EventosService } from '../../service/eventos.service';
import { HabitosService } from '../../service/habitos.service';
import { GastosService } from '../../service/gastos.service';
import { Mensaje } from '../../types/mensaje';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asistente',
  imports: [BackgroundComponent, CommonModule],
  templateUrl: './asistente.component.html',
  styleUrl: './asistente.component.css'
})
export class AsistenteComponent{

  private asistenteService = inject(AsistenteService);

  //Servicios de cada entidad:
  private notasService = inject(NotasService);
  private metasService = inject(MetasService);
  private eventosService = inject(EventosService);
  private habitosService = inject(HabitosService);
  private gastosService = inject(GastosService);


  // ngOnInit() {
  //   this.metasService.getMetas();
  //   this.gastosService.getGastos();
  //   this.habitosService.getHabitos();
  //   this.eventosService.getEventos();
  //   this.notasService.getNotas();
  // }

  historial = signal<Mensaje[]>([{emisor:'noa', texto:'¡Hola! Soy NOA. Elegí una opción y te cuento cómo venís..'}]);
  cargando = signal<boolean>(false);

  menuPrincipal = ['Metas', 'Gastos', 'Hábitos', 'Agenda', 'Notas'];

  preguntasPorCategoria: Record<string, string[]> = {
    'Metas': ['¿Cuáles están atrasadas?', 'Resumen de activas', 'Volver atrás'],
    'Gastos': ['¿Cuánto gasté este mes?', '¿En qué se me fue más plata?', '¿Tengo algún ahorro?' , 'Volver atrás'],
    'Hábitos': ['¿Completé mis hábitos hoy?', '¿Cuántos hábitos tengo en total?', '¿Cuál fue mi mayor período de constancia?', '¿Qué hábito tengo descuidado?', 'Volver atrás'],
    'Agenda': ['¿Tengo algo para hoy?', '¿Tengo ocupada esta semana?', '¿Cuántos eventos tengo este mes?', 'Volver atrás'],
    'Notas': ['¿Cuántas tengo en total?', '¿Cuántas tengo de este mes?', 'Volver atrás']
  }

  opcionesActuales = signal<string[]>(this.menuPrincipal);
  categoriaSeleccionada = signal<string | null>(null);

  seleccionarOpcion(opcion: string){
    this.agregarMensaje('usuario', opcion);

    if (this.menuPrincipal.includes(opcion)) {
      this.categoriaSeleccionada.set(opcion);
      // console.log(opcion);
      switch(opcion) {
        case 'Metas': 
          this.metasService.getMetas(); 
          break;

        case 'Gastos': 
          this.gastosService.getGastos(); 
          break;

        case 'Hábitos': 
          this.habitosService.getHabitos(); 
          break;

        case 'Agenda': 
          this.eventosService.getEventos(); 
          break;

        case 'Notas': 
          this.notasService.getNotas(); 
          break;
      }

      this.opcionesActuales.set(this.preguntasPorCategoria[opcion]);
      this.agregarMensaje('noa', `¡Buenísimo! ¿Qué querés saber sobre tus ${opcion.toLowerCase()}?`); //TERMINAR ESTE
      return;
    }

    if (opcion === 'Volver atrás') {
      this.categoriaSeleccionada.set(null);
      this.opcionesActuales.set(this.menuPrincipal);
      this.agregarMensaje('noa', 'Dale, ¿miramos otra cosa?');
      return;
    }

    this.enviarPregunta(opcion);
  }

  async enviarPregunta(pregunta: string){
    this.cargando.set(true);
    this.opcionesActuales.set([]);

    const contexto = this.obtenerContextoPorCategoria(this.categoriaSeleccionada());
    const respuesta = await this.asistenteService.consultarAsistente(pregunta, contexto);

    this.agregarMensaje('noa', respuesta);
    this.cargando.set(false);

    this.opcionesActuales.set(this.preguntasPorCategoria[this.categoriaSeleccionada()!]);
  }

  agregarMensaje(emisor: 'noa' | 'usuario', texto: string){
    this.historial.update(msj => [...msj, {emisor, texto}]);
  }

  obtenerContextoPorCategoria(categoria: string | null){
    let contexto = ''; 
    switch (categoria) {
      case 'Metas':
        contexto = this.contextoMetas();
        break;

      case 'Gastos':
        contexto = this.contextoGastos();
        break;

      case 'Hábitos':
        contexto = this.contextoHabitos();
        break;
      
      case 'Agenda':
        contexto = this.contextoAgenda();
        break;

      case 'Notas':
        contexto = this.contextoNotas();
        break;
      
      default:
        contexto = 'No hay información.';
        break;
    }
    console.log('Contexto específico: '+ contexto);
    return contexto;
  }

  //OBTENER CONTEXTO DE CADA ENTIDAD: 

  // Preguntas: Metas = ¿Cuáles están atrasadas?, Resumen de activas.
    
  private contextoMetas(): string{
    const metas = this.metasService.metas();

    const activas = metas.filter(m => m.completado !== 2); //2 = archivada
    const titulo = activas.map(m => m.titulo).join(', ');

    const hoy = new Date().toLocaleDateString('en-CA')
    // hoy.setHours(0, 0, 0, 0); 

    const atrasadas = activas.filter(m => {
      if (m.completado === 1) {
        return false;
      }
      
      const fechaMeta = new Date(m.fechaEstipulada).toLocaleDateString('en-CA');
      // fechaMeta.setHours(0, 0, 0, 0);
      return fechaMeta < hoy;
    });

    console.log("hoy: " + hoy);
    const titulosAtrasadas = atrasadas.map(m => m.titulo).join(', ');
    const fechasAtrasadas = atrasadas.map(m => m.fechaEstipulada).join(', '); 

    const contexto = `Tiene ${metas.length} metas. Activas: ${activas.length} (${titulo}). De esas activas, tiene ${atrasadas.length} atrasadas (Son estas: ${titulosAtrasadas || 'Ninguna'} y su fecha estipulada era: ${fechasAtrasadas}).`;
    return contexto;
  }

  // Preguntas: Gastos = ¿Cuánto gasté este mes?, ¿En qué se me fue más plata?, ¿Tengo algún ahorro?

  private contextoGastos(): string{
    const movimientos = this.gastosService.gastos();

    const soloGastos = movimientos.filter(m => m.tipo === 'gasto');
    const soloIngresos = movimientos.filter(m => m.tipo === 'ingreso');

    const totalGastado = soloGastos.reduce((suma, g) => suma + g.importe, 0);
    const totalIngresado = soloIngresos.reduce((suma, i) => suma + i.importe, 0);

    const detalleGastos = soloGastos.map(g => `$${g.importe} en ${g.concepto} (${g.categoria})`).join('. '); 

    const ahorro = totalIngresado - totalGastado; 

    const contexto = `Este mes tuvo un ingreso de: $${totalIngresado} y gastos de $${totalGastado}. El ahorro actual es de $${ahorro}. El detalle de los gastos es: ${detalleGastos || 'Sin gastos registrados'}.`;
    return contexto;
  }

  // Preguntas: Hábitos = ¿Cuántos hábitos tengo en total?, ¿Cuál fue mi mayor período de constancia?, ¿Qué hábito tengo descuidado?

  private contextoHabitos(): string{
    const habitos = this.habitosService.habitos();
    
    const hoy = new Date();
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const periodoActual = `${hoy.getFullYear()}-${mes}-01`; // Ej: "2026-05-01"
    const diaActual = hoy.getDate();

    const detalleHabitos = habitos.map(h => {
      const diasCumplidos = Object.values(h.diasCompletados).filter(estado => estado === 'completado').length;
      const historial = JSON.stringify(h.diasCompletados);
      return `Hábito: ${h.descripcion} (Pertenece al mes: ${h.fecha}. Total cumplidos: ${diasCumplidos} días completados con éxito). Historial de días: ${historial}`;
    }).join(' | ');

    // console.log('detalles: '+ detalleHabitos);
    const contexto = `Hoy es ${diaActual} del periodo ${periodoActual}, si un hábito pertenece al período actual y el día de hoy no figura en sus 'Días', está pendiente de marcar. Tiene ${habitos.length} hábitos en seguimiento. El detalle de progreso es: ${detalleHabitos || 'No hay hábitos registrados'}.`;
    return contexto;
  }

  // Preguntas: Agenda = ¿Tengo algo para hoy?, ¿Tengo ocupada esta semana?, ¿Cuántos eventos tengo este mes?

  private contextoAgenda(): string{
    const eventos = this.eventosService.eventos();

    const detallesEventos = eventos.map(e =>
      `"${e.titulo}" (${e.tipo} el día ${e.fecha} en ${e.lugar})`
    ).join(' | ');

    const hoy = new Date().toLocaleDateString('es-AR');

    const contexto = `Hoy la fecha es ${hoy}. Tiene ${eventos.length} eventos en su agenda. Los detalles son: ${detallesEventos || 'Agenda vacía'}.`;
    return contexto;
  }

  // Preguntas: Notas = ¿Cuántas tengo en total?, ¿Cuántas tengo de este mes?'

  private contextoNotas(): string{
    const notas = this.notasService.notas();

    const detallesNotas = notas.map(n =>
      `Fecha: ${n.fecha}. Título: ${n.titulo}, contenido: ${n.descripcion}`
    ).join(' | '); 

    const hoy = new Date().toLocaleDateString('es-AR'); 

    const contexto = `La fecha de hoy es ${hoy}. Tiene ${notas.length} notas guardadas. El contenido de las mismas es: ${detallesNotas || 'No hay notas guardadas.'}`;
    return contexto;
  }

}
