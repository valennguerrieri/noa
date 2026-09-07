import { diaCalendario } from "../../types/diaCalendario";
import { Evento } from "../../types/eventos";

type DayBuilder<T> = (fecha: Date, esMesActual: boolean) => T;

interface ContextoGeneracion<T>{
  anio: number,
  mes: number, 
  diaSemanaPrimerDia: number,
  ultimoDiaMes: Date,
  ultimoDiaMesAnterior: Date,
  // eventos: Evento[]
  builder: DayBuilder<T>
}

export class CalendarManager{

  static generarCalendario<T>(fechaActual: Date, builder: DayBuilder<T>): T[]{
    // const dias: diaCalendario[] = []; 

    const anio = fechaActual.getFullYear();
    const mes = fechaActual.getMonth(); //Del 0 al 11

    const primerDiaMes = new Date(anio, mes, 1); //Para buscar qué día cae el primero
    const ultimoDiaMes = new Date(anio, mes + 1, 0); //Se pide el día "0" del mes siguiente, y autom. te devuelve el último día

    const diaSemanaPrimerDia = primerDiaMes.getDay(); //Devuelve un nro que significa qué día sem es primero
    const ultimoDiaMesAnterior = new Date(anio, mes, 0);

    const cont: ContextoGeneracion<T> = {
      anio, mes, diaSemanaPrimerDia, ultimoDiaMes, ultimoDiaMesAnterior, builder
    }; 

    const diasPrevios = this.getDiasPrevios(cont);
    const diasActuales = this.getDiasActuales(cont);

    const totalParcial = diasPrevios.length + diasActuales.length;
    const diasSiguientes = this.getDiasSiguientes(cont, totalParcial);

    return [...diasPrevios, ...diasActuales, ...diasSiguientes];
  }


  private static getDiasPrevios<T>(cont: ContextoGeneracion<T>): T[]{
    const dias: T[] = [];

    for(let x = cont.diaSemanaPrimerDia; x > 0; x--){
      const fecha = new Date(cont.anio, cont.mes - 1, cont.ultimoDiaMesAnterior.getDate() - x + 1);
      // dias.push(this.crearDia(fecha, false, cont.eventos));
      dias.push(cont.builder(fecha, false));
    }
    return dias;
  }


  private static getDiasActuales<T>(cont: ContextoGeneracion<T>): T[]{
    const dias: T[] = [];
    
    for(let i = 1; i <= cont.ultimoDiaMes.getDate(); i++){
      const fecha = new Date(cont.anio, cont.mes, i);
      // dias.push(this.crearDia(fecha, true, cont.eventos));
      dias.push(cont.builder(fecha,true));
    }
    return dias;
  }


  private static getDiasSiguientes<T>(cont: ContextoGeneracion<T>, totalAct: number): T[]{
    const dias: T[] = [];
    const diasFaltantes = 42 - totalAct;

    for(let i = 1; i <= diasFaltantes; i++){
      const fecha = new Date(cont.anio, cont.mes + 1, i);
      // dias.push(this.crearDia(fecha, false, cont.eventos));
      dias.push(cont.builder(fecha,false));
    }
    return dias; 
  }

  //Únicamente para componente de agenda
  public static crearDia(fecha: Date, esMesActual: boolean, eventos: Evento[]){
    const hoy = new Date(); 

    const fechaStr = fecha.toLocaleDateString('en-CA');
    const eventosDelDia = eventos.filter(e => {
      const fechaEventoSinHora = e.fecha.toString().split('T')[0];
      return fechaEventoSinHora === fechaStr;
    });

    const numero = fecha.getDate();
    const esHoy = fecha.toDateString() === new Date().toDateString(); 

    return { fecha, numero, esMesActual, esHoy, eventos: eventosDelDia}
  }

  
  static generarSemana(fechaActual: Date, eventos: Evento[]){
    const dias: diaCalendario[] = []; 
    const copiaFecha = new Date(fechaActual);

    const diaSemana = copiaFecha.getDay();
    copiaFecha.setDate(copiaFecha.getDate() - diaSemana);

    for(let i=0; i < 7; i++){
      const fecha = new Date(copiaFecha); //Para ir recorriendo todos los días de la semana y que no sea siempre el mismo.
      dias.push(this.crearDia(fecha, true, eventos));

      copiaFecha.setDate(copiaFecha.getDate() + 1);
    }
    return dias; 
  }
  
  public static crearDiaHabito(fecha: Date, esMesActual: boolean, diasCompletados: any){
    const numero = fecha.getDate();
    if (!esMesActual) {
      return { numero, clase: 'externo' };
    }
    
    const registro = diasCompletados || {};
    const estado = registro[numero];

    let clase = 'pendiente'; 

    switch(estado){
      case 'completado':
        clase = 'completado';
        break;

      case 'fallido':
        clase = 'fallido'; 
        break;
    }

    const esHoy = fecha.toDateString() === new Date().toDateString(); 
    // const completado = diasCompletados.includes(numero);

    return { numero, clase, esHoy};
  }
}