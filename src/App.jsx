import { useState, useEffect } from 'react'
import TopBar from './components/TopBar'
import TodoList from './components/TodoList'
import CalendarView from './components/CalendarView'
import ArchiveModal from './components/ArchiveModal'
import HelpModal from './components/HelpModal'
import SettingsModal from './components/SettingsModal'

const STORAGE_KEY = 'momo-todos'
const THEME_KEY = 'momo-theme'

const THEMES = {
  mint: {
    '--color-primary': '#94bba9',
    '--color-secondary': '#E5EEE4',
    '--color-accent': '#DC9B9B',
    '--color-bg': '#F6F4E8',
    '--color-white': '#ffffff',
    '--color-text': '#2d3436',
    '--color-text-light': '#636e72',
    '--topbar-bg': '#94bba9',
    '--title-grad-start': '#5a8f7b',
    '--title-grad-end': '#c07a7a',
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
  },
}

function applyTheme(theme) {
  const root = document.documentElement
  const vars = THEMES[theme]
  Object.entries(vars).forEach(([key, val]) => {
    root.style.setProperty(key, val)
  })
}

function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function App() {
  const [alwaysOnTop, setAlwaysOnTop] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const [todos, setTodos] = useState(loadTodos)
  const [mainView, setMainView] = useState('todo')
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'mint')
  const [showHelp, setShowHelp] = useState(() => !localStorage.getItem('momo-visited'))
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  return (
    <div className={`app-container ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <TopBar
        alwaysOnTop={alwaysOnTop}
        onToggleAlwaysOnTop={() => setAlwaysOnTop(prev => !prev)}
        onOpenArchive={() => setShowArchive(true)}
        mainView={mainView}
        setMainView={setMainView}
        theme={theme}
        setTheme={setTheme}
        onOpenHelp={() => setShowHelp(true)}
        onOpenSettings={() => setShowSettings(true)}
      />
      <main className="main-content">
        {mainView === 'todo' ? (
          <TodoList todos={todos} setTodos={setTodos} />
        ) : (
          <CalendarView todos={todos} setTodos={setTodos} />
        )}
      </main>
      {showArchive && (
        <ArchiveModal
          onClose={() => setShowArchive(false)}
          onRestore={(todo) => setTodos(prev => [...prev, todo])}
        />
      )}
      {showHelp && (
        <HelpModal onClose={() => {
          localStorage.setItem('momo-visited', 'true')
          setShowHelp(false)
        }} />
      )}
      {showSettings && (
       <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}

export default App