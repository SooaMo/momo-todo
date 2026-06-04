import React from 'react'
import { useState, useEffect, useRef } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import AddTodoModal from './AddTodoModal'
import { saveToArchive } from './ArchiveModal'
import BannerImage from './BannerImage'
import { getT } from '../i18n'

const STORAGE_KEY = 'momo-todos'

const PRIORITY_ORDER = { high: 0, mid: 1, low: 2 }

function formatDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}

function SortableTodoItem({ todo, done, expandedIds, setExpandedIds, handleToggle, handleArchive, setEditTodo, lang }) {
  const t = getT(lang)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <li ref={setNodeRef} style={style} className={`todo-item ${done ? 'completed' : ''}`}>
      <button className="todo-drag-handle" {...attributes} {...listeners} tabIndex={-1}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="5" r="1" fill="currentColor"/><circle cx="15" cy="5" r="1" fill="currentColor"/>
          <circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/>
          <circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/>
        </svg>
      </button>
      <button className="todo-check" onClick={() => handleToggle(todo.id)}>
        {done ? '✓' : ''}
      </button>
      <div className="todo-info">
        <div
          className="todo-title-row"
          onClick={() => {
            if (!todo.memo) return
            setExpandedIds(prev => {
              const next = new Set(prev)
              next.has(todo.id) ? next.delete(todo.id) : next.add(todo.id)
              return next
            })
          }}
          style={{ cursor: todo.memo ? 'pointer' : 'default' }}
        >
          <span className="todo-title">{todo.title}</span>
          <div className="todo-actions">
            {todo.memo && (
              <span className="memo-indicator">
                {expandedIds.has(todo.id) ? '▲' : '▼'}
              </span>
            )}
            <button className="todo-edit" onClick={e => { e.stopPropagation(); setEditTodo(todo) }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button className="todo-delete" onClick={e => { e.stopPropagation(); handleArchive(todo.id) }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="todo-meta">
          <span className={`priority-badge priority-${todo.priority}`}>
            {todo.priority === 'high' ? t.priorityHigh : todo.priority === 'mid' ? t.priorityMid : t.priorityLow}
          </span>
          <span className="type-badge">
            {todo.type === 'daily' ? t.tabDaily : todo.type === 'weekly' ? t.tabWeekly : todo.type === 'date' ? t.tabDate : t.tabOneTime}
          </span>
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
        {todo.memo && expandedIds.has(todo.id) && (
          <div className="todo-memo">{formatMemoWithLinks(todo.memo)}</div>
        )}
      </div>
    </li>
  )
}

function formatMemoWithLinks(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)
  return parts.map((part, i) => {
    if (part.match(/^https?:\/\//)) {
      try {
        const url = new URL(part)
        const domain = url.hostname.replace('www.', '')
        const pathParts = url.pathname.split('/').filter(Boolean)
        const lastPath = pathParts[pathParts.length - 1] || ''
        const label = lastPath ? `${domain}/${lastPath}` : domain
        return React.createElement('a', {
          key: i,
          className: 'memo-link',
          onClick: (e) => {
            e.preventDefault()
            e.stopPropagation()
            window.electronAPI?.openExternal(part)
          }
        }, label)
      } catch {
        return part
      }
    }
    return part
  })
}

function TodoList({ todos, setTodos, lang, onOpenSettings }) {
  const t = getT(lang)
  const todayStr = formatDateStr(new Date())
  const [showModal, setShowModal] = useState(false)
  const [editTodo, setEditTodo] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [activePriority, setActivePriority] = useState('all')
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false)
  const [expandedIds, setExpandedIds] = useState(new Set())
  const [manualOrder, setManualOrder] = useState([])
  const dropdownRef = useRef(null)

  const TABS = [
  { id: 'all', label: t.tabAll },
  { id: 'daily', label: t.tabDaily },
  { id: 'weekly', label: t.tabWeekly },
  { id: 'date', label: t.tabDate },
  { id: 'one-time', label: t.tabOneTime },
]

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  }))

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPriorityDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAdd = (todo) => setTodos(prev => [...prev, todo])
  const handleEdit = (updated) => setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))

  const handleToggle = (id) => {
  setTodos(prev => prev.map(t => {
    if (t.id !== id) return t
    const completions = { ...t.completions }
    if (completions[todayStr]) delete completions[todayStr]
    else completions[todayStr] = true
    return { ...t, completions }
  }))
}

  const handleArchive = (id) => {
    const todo = todos.find(t => t.id === id)
    if (todo) {
      saveToArchive(todo)
      setTodos(prev => prev.filter(t => t.id !== id))
      setManualOrder(prev => prev.filter(i => i !== id))
    }
  }

  const isTodayCompleted = (todo) => {
      if (todo.type === 'date') {
        return !!(todo.completions && Object.keys(todo.completions).length > 0)
      }
      return !!(todo.completions?.[todayStr])
    }

  const isVisibleToday = (todo) => {
    const today = new Date()
    const dayOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][today.getDay()]
    if (todo.type === 'daily') return true
    if (todo.type === 'weekly') return todo.selectedDays?.includes(dayOfWeek)
    if (todo.type === 'date') return todayStr >= todo.startDate && todayStr <= todo.endDate
    if (todo.type === 'one-time') {
      if (!todo.dueDate) return true
      return !(todo.completions?.[todo.dueDate])
    }
    return true
  }

  const baseTodos = todos
    .filter(t => isVisibleToday(t))
    .filter(t => activeTab === 'all' || t.type === activeTab)
    .filter(t => activePriority === 'all' || t.priority === activePriority)

  const filteredTodos = manualOrder.length > 0
    ? [...baseTodos].sort((a, b) => {
        const ai = manualOrder.indexOf(a.id)
        const bi = manualOrder.indexOf(b.id)
        if (ai === -1 && bi === -1) {
          const aComp = isTodayCompleted(a)
          const bComp = isTodayCompleted(b)
          if (aComp !== bComp) return aComp ? 1 : -1
          return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
        }
        if (ai === -1) return 1
        if (bi === -1) return -1
        return ai - bi
      })
    : [...baseTodos].sort((a, b) => {
        const aComp = isTodayCompleted(a)
        const bComp = isTodayCompleted(b)
        if (aComp !== bComp) return aComp ? 1 : -1
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      })

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = filteredTodos.findIndex(t => t.id === active.id)
    const newIndex = filteredTodos.findIndex(t => t.id === over.id)
    const newOrder = arrayMove(filteredTodos, oldIndex, newIndex).map(t => t.id)
    setManualOrder(newOrder)
  }

  const today = new Date()
  const dateLabel = t.dateLabel(
    today.getMonth(),
    today.getDate(),
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][today.getDay()]
  )
  const priorityLabel = activePriority === 'all' ? t.priority
  : activePriority === 'high' ? t.priorityHigh
  : activePriority === 'mid' ? t.priorityMid
  : t.priorityLow

  return (
    <div className="todo-list">
      <BannerImage imageKey="momo-banner-top" className="banner-top" onOpenSettings={onOpenSettings} />

      <div className="today-label">{dateLabel}</div>

      <div className="filter-row">
        <div className="tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
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
              {[
                { id: 'all', label: t.priority },
                { id: 'high', label: t.priorityHigh },
                { id: 'mid', label: t.priorityMid },
                { id: 'low', label: t.priorityLow },
              ].map(p => (
                <button
                  key={p.id}
                  className={`priority-dropdown-item priority-item-${p.id} ${activePriority === p.id ? 'active' : ''}`}
                  onClick={() => {
                    setActivePriority(p.id)
                    setShowPriorityDropdown(false)
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {filteredTodos.length === 0 ? (
        <p className="empty-text">{t.noTodos}</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredTodos.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <ul className="todo-items">
              {filteredTodos.map(todo => (
                <SortableTodoItem
                  key={todo.id}
                  todo={todo}
                  done={isTodayCompleted(todo)}
                  expandedIds={expandedIds}
                  setExpandedIds={setExpandedIds}
                  handleToggle={handleToggle}
                  handleArchive={handleArchive}
                  setEditTodo={setEditTodo}
                  lang={lang}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      <button className="add-btn" onClick={() => setShowModal(true)}>
        {t.addTodo}
      </button>

      {showModal && (
        <AddTodoModal onClose={() => setShowModal(false)} onAdd={handleAdd} lang={lang} />
      )}
      {editTodo && (
        <AddTodoModal onClose={() => setEditTodo(null)} onAdd={handleEdit} initialData={editTodo} lang={lang} />
      )}
    </div>
  )
}

export default TodoList