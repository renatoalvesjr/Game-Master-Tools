const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: (data) => ipcRenderer.invoke('openFile', data),
  saveFile: (data) => ipcRenderer.invoke('saveFile', data),
  listFiles: (data) => ipcRenderer.invoke('listFiles', data),
  updateFile: (data) => ipcRenderer.invoke('updateFile', data),
  createFile: (data) => ipcRenderer.invoke('createFile', data),
  deleteFile: (data) => ipcRenderer.invoke('deleteFile', data),
})
