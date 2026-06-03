import { useState, useEffect, useRef } from 'react'
import AddTodoModal from './AddTodoModal'
import { saveToArchive } from './ArchiveModal'

const STORAGE_KEY = 'momo-todos'
const TABS = ['all', 'daily', 'weekly', 'date', 'one-time']
const PRIORITY_ORDER = { high: 0, mid: 1, low: 2 }

function formatDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}

function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function TodoList({ todos, setTodos }) {
  const todayStr = formatDateStr(new Date())
  const [showModal, setShowModal] = useState(false)
  const [editTodo, setEditTodo] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [activePriority, setActivePriority] = useState('all')
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPriorityDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAdd = (todo) => {
    setTodos(prev => [...prev, todo])
  }

  const handleEdit = (updated) => {
    setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  const handleToggle = (id) => {
    setTodos(prev => prev.map(t => {
      if (t.id !== id) return t
      const completions = { ...t.completions }
      if (completions[todayStr]) {
        delete completions[todayStr]
      } else {
        completions[todayStr] = true
      }
      return { ...t, completions }
    }))
  }

  const handleArchive = (id) => {
    const todo = todos.find(t => t.id === id)
    if (todo) {
      saveToArchive(todo)
      setTodos(prev => prev.filter(t => t.id !== id))
    }
  }

  const isTodayCompleted = (todo) => !!(todo.completions?.[todayStr])

  const isVisibleToday = (todo) => {
  const today = new Date()
  const dayOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][today.getDay()]
  if (todo.type === 'daily') return true
  if (todo.type === 'weekly') return todo.selectedDays?.includes(dayOfWeek)
  if (todo.type === 'date') return todayStr >= todo.startDate && todayStr <= todo.endDate
  if (todo.type === 'one-time') {
    // show until completed on due date, or if no due date
    if (!todo.dueDate) return true
    const isDone = !!(todo.completions?.[todo.dueDate])
    return !isDone
  }
  return true
}

  const filteredTodos = todos
    .filter(t => isVisibleToday(t))
    .filter(t => activeTab === 'all' || t.type === activeTab)
    .filter(t => activePriority === 'all' || t.priority === activePriority)
    .slice()
    .sort((a, b) => {
      const aComp = isTodayCompleted(a)
      const bComp = isTodayCompleted(b)
      if (aComp !== bComp) return aComp ? 1 : -1
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    })

  const priorityLabel = activePriority === 'all' ? 'Priority' : activePriority
  const today = new Date()
  const dateLabel = `${today.getMonth()+1}월 ${today.getDate()}일 (${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][today.getDay()]})`

  return (
    <div className="todo-list">
      <div className="today-label">{dateLabel}</div>

      <div className="filter-row">
  <div className="tabs">
    {TABS.map(tab => (
      <button
        key={tab}
        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
        onClick={() => setActiveTab(tab)}
      >
        {tab}
      </button>
    ))}
  </div>

  <div className="filter-divider" />

  <div className="priority-dropdown-wrap" ref={dropdownRef}>
          <button
            className={`priority-dropdown-btn ${activePriority !== 'all' ? 'active' : ''}`}
            onClick={() => setShowPriorityDropdown(prev => !prev)}
          >
            {priorityLabel}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {showPriorityDropdown && (
            <div className="priority-dropdown">
              {['all', 'high', 'mid', 'low'].map(p => (
                <button
                  key={p}
                  className={`priority-dropdown-item priority-item-${p} ${activePriority === p ? 'active' : ''}`}
                  onClick={() => {
                    setActivePriority(p)
                    setShowPriorityDropdown(false)
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {filteredTodos.length === 0 ? (
        <p className="empty-text">오늘 할 일이 없어요!</p>
      ) : (
        <ul className="todo-items">
          {filteredTodos.map(todo => {
            const done = isTodayCompleted(todo)
            return (
              <li key={todo.id} className={`todo-item ${done ? 'completed' : ''}`}>
                <button className="todo-check" onClick={() => handleToggle(todo.id)}>
                  {done ? '✓' : ''}
                </button>
                <div className="todo-info">
                  <div className="todo-title-row">
                    <span className="todo-title">{todo.title}</span>
                    <div className="todo-actions">
                      <button className="todo-edit" onClick={() => setEditTodo(todo)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button className="todo-delete" onClick={() => handleArchive(todo.id)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="todo-meta">
                    <span className={`priority-badge priority-${todo.priority}`}>{todo.priority}</span>
                    <span className="type-badge">{todo.type}</span>
                    {todo.time && <span className="time-badge">⏰ {todo.time}</span>}
                    {todo.type === 'date' && todo.startDate && (
                      <span className="time-badge">📅 {todo.startDate} ~ {todo.endDate}</span>
                    )}
                    {todo.type === 'weekly' && todo.selectedDays?.length > 0 && (
                      <span className="time-badge">🗓 {todo.selectedDays.join(', ')}</span>
                    )}
                    {todo.type === 'one-time' && todo.dueDate && (
                      <span className="time-badge">📅 due {todo.dueDate}</span>
                    )}
                    {todo.label && (
                      <span className="todo-label" style={{ backgroundColor: todo.label.color }}>
                        {todo.label.text}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <button className="add-btn" onClick={() => setShowModal(true)}>
        + Add Todo
      </button>

      {showModal && (
        <AddTodoModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}
      {editTodo && (
        <AddTodoModal onClose={() => setEditTodo(null)} onAdd={handleEdit} initialData={editTodo} />
      )}
    </div>
  )
}

export default TodoList