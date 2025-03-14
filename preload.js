const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  returnFile: (data) => ipcRenderer.invoke('returnFile', data),
  saveFile: (data) => ipcRenderer.invoke('saveFile', data),
  returnAllFiles: (data) => ipcRenderer.invoke('returnAllFiles', data),
  deleteFile: (data) => ipcRenderer.invoke('deleteFile', data),
  onStart: () => ipcRenderer.invoke('onStart'),
})
