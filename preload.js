const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('openFile'),
  saveFile: (data) => ipcRenderer.invoke('saveFile',  data),
})
