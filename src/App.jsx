import { useState, useEffect } from 'react'
import TopBar from './components/TopBar'
import TodoList from './components/TodoList'
import CalendarView from './components/CalendarView'
import ArchiveModal from './components/ArchiveModal'

const STORAGE_KEY = 'momo-todos'

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

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  return (
    <div className="app-container">
      <TopBar
        alwaysOnTop={alwaysOnTop}
        onToggleAlwaysOnTop={() => setAlwaysOnTop(prev => !prev)}
        onOpenArchive={() => setShowArchive(true)}
        mainView={mainView}
        setMainView={setMainView}
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
    </div>
  )
}

export default App