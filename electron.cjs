const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const Store = require('electron-store')

const store = new Store()

let mainWindow

function createWindow() {
  const savedBounds = store.get('windowBounds', {
    width: 420,
    height: 700,
    x: undefined,
    y: undefined,
  })

  mainWindow = new BrowserWindow({
    width: savedBounds.width,
    height: savedBounds.height,
    x: savedBounds.x,
    y: savedBounds.y,
    minWidth: 420,
    minHeight: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hiddenInset',
    frame: false,
    transparent: false,
    resizable: true,
    alwaysOnTop: false,
  })

  const isDev = !app.isPackaged
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'))
  }

  const saveBounds = () => {
    store.set('windowBounds', mainWindow.getBounds())
  }

  mainWindow.on('resize', saveBounds)
  mainWindow.on('move', saveBounds)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('toggle-always-on-top', () => {
  const current = mainWindow.isAlwaysOnTop()
  mainWindow.setAlwaysOnTop(!current)
  return !current
})

ipcMain.handle('minimize-window', () => mainWindow.minimize())
ipcMain.handle('close-window', () => mainWindow.hide())