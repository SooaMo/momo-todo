const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require('electron')
const path = require('path')
const Store = require('electron-store')
const { autoUpdater } = require('electron-updater')

const store = new Store()

let mainWindow
let tray
let updateAvailable = false

// Auto updater settings
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false

autoUpdater.on('update-available', (info) => {
  updateAvailable = true
  mainWindow.webContents.send('update-available', info)
})

autoUpdater.on('update-not-available', () => {
  mainWindow.webContents.send('update-not-available')
})

autoUpdater.on('download-progress', (progress) => {
  mainWindow.webContents.send('update-download-progress', progress)
})

autoUpdater.on('update-downloaded', (info) => {
  mainWindow.webContents.send('update-downloaded', info)
})

autoUpdater.on('error', (err) => {
  mainWindow.webContents.send('update-error', err.message)
})

function createTray() {
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'icon.ico')
    : path.join(__dirname, 'build', 'icon.ico')

  let trayIcon
  try {
    trayIcon = nativeImage.createFromPath(iconPath)
    if (trayIcon.isEmpty()) throw new Error('empty')
  } catch {
    trayIcon = nativeImage.createFromDataURL(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAAN0lEQVQ4jWNgGAWjAAj+/2e4z0ABYBIZMBoGAAAA//8DABl6B//FRBVVAAAAAElFTkSuQmCC'
    )
  }

  tray = new Tray(trayIcon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open MomoTodo',
      click: () => {
        mainWindow.show()
        mainWindow.focus()
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true
        app.quit()
      }
    }
  ])

  tray.setToolTip('MomoTodo')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
      mainWindow.focus()
    }
  })
}

function createWindow() {
  const savedBounds = store.get('windowBounds', {
    width: 460,
    height: 700,
    x: undefined,
    y: undefined,
  })

  mainWindow = new BrowserWindow({
    width: savedBounds.width,
    height: savedBounds.height,
    x: savedBounds.x,
    y: savedBounds.y,
    minWidth: 460,
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
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'))
  }

  const saveBounds = () => {
    if (mainWindow) store.set('windowBounds', mainWindow.getBounds())
  }

  mainWindow.on('resize', saveBounds)
  mainWindow.on('move', saveBounds)

  mainWindow.on('close', () => {
    app.isQuiting = true
    app.quit()
  })
}

app.whenReady().then(() => {
  createWindow()
  createTray()

  mainWindow.webContents.once('did-finish-load', () => {
    if (!store.get('startupPromptShown')) {
      mainWindow.webContents.send('show-startup-prompt', app.getLoginItemSettings().openAtLogin)
    }
    if (!store.get('helpShown')) {
      mainWindow.webContents.send('show-help')
      store.set('helpShown', true)
    }

    // 업데이트 확인 (빌드된 앱에서만)
    if (app.isPackaged) {
      setTimeout(() => {
        autoUpdater.checkForUpdates()
      }, 3000)
    }
  })
})

app.on('window-all-closed', () => {})
app.on('before-quit', () => { app.isQuiting = true })
app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show()
    mainWindow.focus()
  }
})

// IPC handlers
ipcMain.handle('toggle-always-on-top', () => {
  const current = mainWindow.isAlwaysOnTop()
  mainWindow.setAlwaysOnTop(!current)
  return !current
})

ipcMain.handle('minimize-window', () => mainWindow.minimize())

ipcMain.handle('close-window', () => {
  app.isQuiting = true
  app.quit()
})

ipcMain.handle('resize-window', (event, width) => {
  const [, currentHeight] = mainWindow.getSize()
  mainWindow.setSize(width, currentHeight)
})

ipcMain.handle('get-window-size', () => {
  const [width, height] = mainWindow.getSize()
  return { width, height }
})

ipcMain.handle('set-login-item', (event, enable) => {
  app.setLoginItemSettings({ openAtLogin: enable })
  store.set('startupPromptShown', true)
})

ipcMain.handle('dismiss-startup-prompt', () => {
  store.set('startupPromptShown', true)
})

ipcMain.handle('check-for-updates', () => {
  if (app.isPackaged) {
    autoUpdater.checkForUpdates()
  } else {
    mainWindow.webContents.send('update-not-available')
  }
})

ipcMain.handle('download-update', () => {
  autoUpdater.downloadUpdate()
})

ipcMain.handle('install-update', () => {
  autoUpdater.quitAndInstall()
})

ipcMain.handle('get-update-available', () => updateAvailable)