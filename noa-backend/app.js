import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'url';

import { GoogleAuthService } from './auth/google-auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let appWindow, db;
const authService = new GoogleAuthService();

function createWindow(){
  appWindow = new BrowserWindow({
      width: 700,
      height: 1000,
      resizable: true,
      maximizable: true,
      icon: path.join(__dirname, 'noa-avatar.ico'),
      webPreferences: {
        preload: path.join(__dirname, 'preload.cjs')
      }
  })

  // appWindow.webContents.openDevTools();
  appWindow.setMenu(null);

  // appWindow.loadFile(path.join(__dirname, '../noa-frontend/dist/noa/browser/index.html'));
  // appWindow.loadURL('http://localhost:4200');
  appWindow.loadFile(path.join(__dirname, 'frontend-dist/index.html')); //Para el instalador
    
  appWindow.on('closed', function(){
    appWindow = null
  })
}

app.whenReady().then(() => {  
  createWindow();
})

ipcMain.handle('google-login', async () => {
  try {
    // Una sola línea limpia
    const tokens = await authService.login();
    return { success: true, data: tokens };
  } catch (error) {
    return { success: false, error: error.message };
  }
});