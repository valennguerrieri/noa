import { shell } from 'electron';
import http from 'http';
import axios from 'axios';

import fs from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import 'dotenv/config'; 

export class GoogleAuthService {
  
  constructor() {
    this.config = {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
      redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://127.0.0.1:5000/callback',
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scope: 'openid profile email',
      port: Number(process.env.PORT) || 5000,
    };
  }

  // Método principal (pub): Inicia todo el flujo y devuelve los tokens
  async login(){
    try{
      await this.openBrowser();
      const code = await this.waitForAuthorizationCode();
      const tokens = await this.exchangeCodeForToken(code);
      // console.log('TOKENS: ', tokens);

      //Obtener datos legibles del usuario
      const usuario = await this.fetchUserProfile(tokens.access_token);
      // console.log('USUARIO: ',usuario);
      return{
        perfil: usuario,
        idToken: tokens.id_token
      };
    }catch(error){
      console.log('Error en el servicio de Auth:', error);
      throw error;
    }
  }

  // Métodos secundarios (priv)
  openBrowser(){ //Abre el navegador
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scope,
    });
    
    const url = `${this.config.authUrl}?${params.toString()}`;
    return shell.openExternal(url);
  }

  waitForAuthorizationCode(){ //Espera a que el usuario autorice 
    return new Promise((resolve, reject) => {
      const server = http.createServer((req, res) => {
        if(!req.url.startsWith('/callback')) return; //Solo la URL que empiece con /callback
        try{
          const urlParams = new URL(req.url, `http://127.0.0.1:${this.config.port}`).searchParams;
          const code = urlParams.get('code');

          if(code){
            this.sendResponse(res, 'LOGIN EXITOSO.');
            server.close(); 
            resolve(code); //Promesa "cumplida"
            console.log("Login exitoso.");
          }else{
            server.close();
            reject(new Error('No se recibió ningún código'));
          }
        }catch(error){
          server.close();
          reject(error); //Promesa rechazada
        }
      });

      server.listen(this.config.port, () => {
        console.log(`Esperando auth en puerto ${this.config.port}...`);
      });
      
      server.on('error', (err) => reject(err));
    });
  }

  async exchangeCodeForToken(code){
    const response = await axios.post(this.config.tokenUrl, {
      code,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uri: this.config.redirectUri,
      grant_type: 'authorization_code',
    });
    return response.data;
  }

  sendResponse(res, message){
    try{
      const filePath = path.join(__dirname, 'templates', 'auth-success.html'); // Buscar archivo HTML
      let html = fs.readFileSync(filePath, 'utf-8'); //Leer cont. como texto
      html = html.replace('{{MESSAGE}}', message); //Reemplazar x mensaje real

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);

    }catch(error){
      console.error('Error leyendo HTML:', error);
    }
  }

  async fetchUserProfile(accessToken) {
    const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers:{
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

}
