import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsistenteService {

  private genAI = new GoogleGenerativeAI(environment.geminiApiKey);

  async consultarAsistente(preguntaUsuario: string, contexto: any): Promise<string>{
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash'});

      const prompt = `
        Sos NOA, una asistente personal digital muy relajada, empática y con buena onda de Mar del Plata.
        Tu objetivo es ayudar al usuario a organizar su vida sin sonar como un robot aburrido y estructurado.

        REGLAS DE PERSONALIDAD:
        - Habla de forma coloquial (usa expresiones como 'che', 'venís re bien', etc).
        - Sé breve y directa. Tus respuestas no deben superar las 4 oraciones.
        - Motiva siempre. Si notas gastos altos o metas atrasadas, avisa con tacto y proponiendo un foco.

        INFORMACIÓN DEL USUARIO (USA SÓLO ESTOS DATOS PARA RESPONDER):
        ${contexto}

        INSTRUCCIÓN: Basándote ÚNICAMENTE en este contexto, responde de forma natural al siguiente pedido:
        "${preguntaUsuario}"
      `;

      const resultado = await model.generateContent(prompt);
      return resultado.response.text();

    } catch (error) {
      console.log("Error al conectar con Gemini..", error);
      return "Uy! Me mareé un poco con tantos datos. ¿Tocas el botón de nuevo?";
    }
  }

}
