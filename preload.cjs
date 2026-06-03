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
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  getUpdateAvailable: () => ipcRenderer.invoke('get-update-available'),
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
  onUpdateNotAvailable: (callback) => ipcRenderer.on('update-not-available', callback),
  onUpdateDownloadProgress: (callback) => ipcRenderer.on('update-download-progress', callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
  onUpdateError: (callback) => ipcRenderer.on('update-error', callback),
})