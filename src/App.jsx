import { useState, useEffect } from 'react'
import TopBar from './components/TopBar'
import TodoList from './components/TodoList'
import CalendarView from './components/CalendarView'
import ArchiveModal from './components/ArchiveModal'
import HelpModal from './components/HelpModal'
import SettingsModal from './components/SettingsModal'
import StickerLayer from './components/StickerLayer'
import StickerPanel from './components/StickerPanel'
import StartupModal from './components/StartupModal'
import { useAlarmChecker } from './components/AlarmPopup'


const STORAGE_KEY = 'momo-todos'
const THEME_KEY = 'momo-theme'
const FOLDERS_KEY = 'momo-folders'

const THEMES = {
  mint: {
    '--color-primary': '#8ecfbe',
    '--color-secondary': '#e8f7f3',
    '--color-accent': '#f4a8a0',
    '--color-bg': '#f5fbf9',
    '--color-white': '#ffffff',
    '--color-text': '#2d3d38',
    '--color-text-light': '#5a8a78',
    '--topbar-bg': '#8ecfbe',
    '--title-grad-start': '#5aab94',
    '--title-grad-end': '#e08888',

    '--color-urgency-low': '#f0b429',  
    '--color-urgency-mid': '#e07a30',   
    '--color-urgency-high': '#e03030',  
  },
  peach: {
    '--color-primary': '#e8a87c',
    '--color-secondary': '#fdf0e8',
    '--color-accent': '#9b8ec4',
    '--color-bg': '#fef8f3',
    '--color-white': '#ffffff',
    '--color-text': '#3d2e24',
    '--color-text-light': '#a07858',
    '--topbar-bg': '#e8a87c',
    '--title-grad-start': '#c07840',
    '--title-grad-end': '#9b8ec4',
        '--color-urgency-low': '#f0b429',  
    '--color-urgency-mid': '#e07a30',   
    '--color-urgency-high': '#e03030',
  },
  rose: {
    '--color-primary': '#d4849a',
    '--color-secondary': '#faeef1',
    '--color-accent': '#7ba7bc',
    '--color-bg': '#fdf5f7',
    '--color-white': '#ffffff',
    '--color-text': '#3d2430',
    '--color-text-light': '#a06878',
    '--topbar-bg': '#d4849a',
    '--title-grad-start': '#b05870',
    '--title-grad-end': '#7ba7bc',
        '--color-urgency-low': '#f0b429',  
    '--color-urgency-mid': '#e07a30',   
    '--color-urgency-high': '#e03030',
  },
  ocean: {
    '--color-primary': '#7ba7bc',
    '--color-secondary': '#dce8ef',
    '--color-accent': '#e07b6a',
    '--color-bg': '#f0f4f7',
    '--color-white': '#ffffff',
    '--color-text': '#2c3e50',
    '--color-text-light': '#5a7a8a',
    '--topbar-bg': '#7ba7bc',
    '--title-grad-start': '#4a7a8a',
    '--title-grad-end': '#e07b6a',
        '--color-urgency-low': '#f0b429',  
    '--color-urgency-mid': '#e07a30',   
    '--color-urgency-high': '#e03030',
  },
  lavender: {
    '--color-primary': '#9b8ec4',
    '--color-secondary': '#ece8f5',
    '--color-accent': '#e8a87c',
    '--color-bg': '#f7f5fb',
    '--color-white': '#ffffff',
    '--color-text': '#2d2b3d',
    '--color-text-light': '#7a6aaa',
    '--topbar-bg': '#9b8ec4',
    '--title-grad-start': '#6a5a9a',
    '--title-grad-end': '#e8a87c',
        '--color-urgency-low': '#f0b429',  
    '--color-urgency-mid': '#e07a30',   
    '--color-urgency-high': '#e03030',
  },
  dark: {
    '--color-primary': '#4a9e8a',
    '--color-secondary': '#2a3442',
    '--color-accent': '#e07a7a',
    '--color-bg': '#1e2530',
    '--color-white': '#2a3442',
    '--color-text': '#e8edf3',
    '--color-text-light': '#a0b0c0',
    '--topbar-bg': '#1a2028',
    '--title-grad-start': '#4ac4a4',
    '--title-grad-end': '#e07a7a',
        '--color-urgency-low': '#f0b429',  
    '--color-urgency-mid': '#e07a30',   
    '--color-urgency-high': '#e03030',
  },
}

function applyTheme(theme) {
  const root = document.documentElement
  const vars = THEMES[theme]
  if (!vars) return
  Object.entries(vars).forEach(([key, val]) => {
    root.style.setProperty(key, val)
  })
}

function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch { return [] }
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function loadFolders() {
  try {
    const saved = localStorage.getItem(FOLDERS_KEY)
    return saved ? JSON.parse(saved) : [
      { id: 'default', name: 'Todo!', order: 0, isDefault: true }
    ]
  } catch {
    return [{ id: 'default', name: 'Todo!', order: 0, isDefault: true }]
  }
}

function saveFolders(folders) {
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders))
}

function App() {
  const [alwaysOnTop, setAlwaysOnTop] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const [todos, setTodos] = useState(loadTodos)
  const [folders, setFolders] = useState(loadFolders)
  const [mainView, setMainView] = useState('todo')
  const [calView, setCalView] = useState('month')
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'mint')
  const [lang, setLang] = useState(() => localStorage.getItem('momo-lang') || 'en')
  const [showHelp, setShowHelp] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settingsTab, setSettingsTab] = useState('graphic')
  const [stickerPanelOpen, setStickerPanelOpen] = useState(false)
  const [stickerMode, setStickerMode] = useState(false)
  const [savedWidth, setSavedWidth] = useState(null)
  const [showStartupPrompt, setShowStartupPrompt] = useState(false)
  const [hasUpdate, setHasUpdate] = useState(false)

  useAlarmChecker(todos, lang)

  // 기존 todo에 folderId 없으면 default 폴더로 마이그레이션
  useEffect(() => {
    setTodos(prev => {
      const needsMigration = prev.some(todo => todo.folderId === undefined)
      if (!needsMigration) return prev
      return prev.map(todo =>
        todo.folderId === undefined ? { ...todo, folderId: 'default' } : todo
      )
    })
  }, [])

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  useEffect(() => {
    saveFolders(folders)
  }, [folders])

  useEffect(() => {
    localStorage.setItem('momo-lang', lang)
  }, [lang])

  useEffect(() => {
    window.electronAPI?.onShowStartupPrompt(() => setShowStartupPrompt(true))
    window.electronAPI?.onShowHelp(() => setShowHelp(true))
    window.electronAPI?.onUpdateAvailable(() => setHasUpdate(true))
    window.electronAPI?.getUpdateAvailable?.().then(avail => {
      if (avail) setHasUpdate(true)
    })
  }, [])

  const handleToggleStickerPanel = async () => {
    const next = !stickerPanelOpen
    if (next) {
      const size = await window.electronAPI?.getWindowSize()
      const currentWidth = size?.width || 460
      setSavedWidth(currentWidth)
      document.documentElement.style.setProperty('--main-width', `${currentWidth}px`)
      window.electronAPI?.resizeWindow(currentWidth + 210)
    } else {
      document.documentElement.style.removeProperty('--main-width')
      window.electronAPI?.resizeWindow(savedWidth || 460)
    }
    setStickerPanelOpen(next)
    setStickerMode(next)
  }

  const pageKey = mainView === 'todo' ? 'today' : `calendar-${calView}`

  return (
    <div className={`app-container ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <TopBar
        alwaysOnTop={alwaysOnTop}
        onToggleAlwaysOnTop={async () => {
          const result = await window.electronAPI?.toggleAlwaysOnTop()
          if (result !== undefined) setAlwaysOnTop(result)
        }}
        onOpenArchive={() => setShowArchive(true)}
        mainView={mainView}
        setMainView={setMainView}
        onOpenSettings={() => setShowSettings(true)}
        stickerPanelOpen={stickerPanelOpen}
        onToggleStickerPanel={handleToggleStickerPanel}
        hasUpdate={hasUpdate}
        lang={lang}
      />

      <div className="app-body">
        <main className="main-content">
          {mainView === 'todo' ? (
            <TodoList
              todos={todos}
              setTodos={setTodos}
              folders={folders}
              setFolders={setFolders}
              lang={lang}
              onOpenSettings={() => { setSettingsTab('graphic'); setShowSettings(true) }}
            />
          ) : (
            <CalendarView
              todos={todos}
              setTodos={setTodos}
              calView={calView}
              setCalView={setCalView}
              lang={lang}
              folders={folders}
            />
          )}
           <StickerLayer pageKey={pageKey} stickerMode={stickerMode} />
        </main>

       

        {stickerPanelOpen && (
          <StickerPanel
            onClose={handleToggleStickerPanel}
            pageKey={pageKey}
            lang={lang}
          />
        )}
      </div>

      {showArchive && (
        <ArchiveModal
          onClose={() => setShowArchive(false)}
          onRestore={(todo) => setTodos(prev => [...prev, todo])}
          lang={lang}
        />
      )}
      {showHelp && (
        <HelpModal onClose={() => setShowHelp(false)} lang={lang} />
      )}
      {showSettings && (
        <SettingsModal
          onClose={() => {
            applyTheme(theme)
            setShowSettings(false)
          }}
          lang={lang}
          setLang={setLang}
          onPreviewTheme={(themeId) => themeId ? applyTheme(themeId) : applyTheme(theme)}
          initialTab={settingsTab}
        />
      )}
      {showStartupPrompt && (
        <StartupModal onClose={() => setShowStartupPrompt(false)} lang={lang} />
      )}

    </div>
  )
}

export default App