const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI',{
    googleLogin: () => ipcRenderer.invoke('google-login'),
});