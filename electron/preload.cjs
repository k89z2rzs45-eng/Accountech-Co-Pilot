const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform,
  getAppVersion: () => ipcRenderer.invoke('app:version'),
  getUserDataPath: () => ipcRenderer.invoke('app:userDataPath'),
  openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),
  saveFileDialog: (options) => ipcRenderer.invoke('dialog:saveFile', options),
  openFileDialog: (options) => ipcRenderer.invoke('dialog:openFile', options)
});
