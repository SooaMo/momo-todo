const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  toggleAlwaysOnTop: () => ipcRenderer.invoke('toggle-always-on-top'),
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  resizeWindow: (width) => ipcRenderer.invoke('resize-window', width),
  getWindowSize: () => ipcRenderer.invoke('get-window-size'),
  setLoginItem: (enable) => ipcRenderer.invoke('set-login-item', enable),
  dismissStartupPrompt: () => ipcRenderer.invoke('dismiss-startup-prompt'),
  onShowStartupPrompt: (callback) => ipcRenderer.on('show-startup-prompt', callback),
  onShowHelp: (callback) => ipcRenderer.on('show-help', callback),
})