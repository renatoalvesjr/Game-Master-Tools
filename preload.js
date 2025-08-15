const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  returnFile: (data) => ipcRenderer.invoke('returnFile', data),
  saveFile: (data) => ipcRenderer.invoke('saveFile', data),
  returnAllFiles: (data) => ipcRenderer.invoke('returnAllFiles', data),
  deleteFile: (data) => ipcRenderer.invoke('deleteFile', data),
  onStart: () => ipcRenderer.invoke('onStart'),
  toggleTheme: (data) => ipcRenderer.invoke('toggleTheme', data),
  selectImage: () => ipcRenderer.invoke('select-image'),
  readImageAsBase64: (data) => ipcRenderer.invoke('readImageAsBase64', data),
  getDefaultPath: () => ipcRenderer.invoke('getDefaultPath'),
})
