import React from 'react'
import { useState, useEffect, useRef } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
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

const PRIORITY_ORDER = { high: 0, mid: 1, low: 2 }

function formatDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
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

function getUrgencyBorder(todo, todayStr, lang) {
  const t = getT(lang)
  const isCompleted = todo.type === 'date'
    ? !!(todo.completions && Object.keys(todo.completions).length > 0)
    : !!(todo.completions?.[todayStr])
  if (isCompleted) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (todo.type === 'one-time' && todo.dueDate) {
    const [y, m, d] = todo.dueDate.split('-').map(Number)
    const due = new Date(y, m-1, d)
    due.setHours(0, 0, 0, 0)
    const diffDays = Math.floor((due - today) / (1000 * 60 * 60 * 24))

    if (diffDays < 0)   return { color: 'var(--color-urgency-high)', width: '6px', bg: 'var(--color-urgency-bg-high)', badge: t.overdue }
    if (diffDays === 0) return { color: 'var(--color-urgency-high)', width: '6px', bg: 'var(--color-urgency-bg-high)', badge: 'D-day' }
    if (diffDays === 1) return { color: 'var(--color-urgency-mid)',  width: '4px', bg: 'var(--color-urgency-bg-mid)',  badge: 'D-1' }
    if (diffDays <= 3)  return { color: 'var(--color-urgency-low)', width: '3px', bg: 'var(--color-urgency-bg-low)', badge: `D-${diffDays}` }
  }

  if (todo.type === 'date' && todo.endDate) {
    const [y, m, d] = todo.endDate.split('-').map(Number)
    const end = new Date(y, m-1, d)
    end.setHours(0, 0, 0, 0)
    const diffDays = Math.floor((end - today) / (1000 * 60 * 60 * 24))

    if (diffDays < 0)   return { color: 'var(--color-urgency-high)', width: '6px', bg: 'var(--color-urgency-bg-high)', badge: t.overdue }
    if (diffDays === 0) return { color: 'var(--color-urgency-high)', width: '6px', bg: 'var(--color-urgency-bg-high)', badge: 'D-day' }
    if (diffDays === 1) return { color: 'var(--color-urgency-mid)',  width: '4px', bg: 'var(--color-urgency-bg-mid)',  badge: 'D-1' }
    if (diffDays <= 3)  return { color: 'var(--color-urgency-low)', width: '3px', bg: 'var(--color-urgency-bg-low)', badge: `D-${diffDays}` }
  }

  if (todo.type === 'daily' || todo.type === 'weekly') {
    const hours = new Date().getHours()
    if (hours >= 23) return { color: 'var(--color-urgency-high)', width: '6px' }
    if (hours >= 21) return { color: 'var(--color-urgency-mid)', width: '4px' }
  }

  return null
}

function SortableTodoItem({ todo, done, expandedIds, setExpandedIds, handleToggle, handleArchive, setEditTodo, setTodos, lang, isDragOverlay, todayStr }) {
  const t = getT(lang)
  const [editingMemo, setEditingMemo] = useState(false)
  const [memoValue, setMemoValue] = useState(todo.memo || '')
  const memoRef = useRef(null)

  useEffect(() => {
    if (editingMemo && memoRef.current) {
      memoRef.current.focus()
      memoRef.current.select()
    }
  }, [editingMemo])

  const saveMemo = () => {
    setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, memo: memoValue } : t))
    setEditingMemo(false)
  }

  const cancelMemo = () => {
    setMemoValue(todo.memo || '')
    setEditingMemo(false)
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id, data: { type: 'todo', folderId: todo.folderId } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  const urgency = !done ? getUrgencyBorder(todo, todayStr, lang) : null

  return (
    <li
      ref={setNodeRef}
      style={isDragOverlay ? {} : {
        ...style,
        borderTop: urgency ? `2px solid ${urgency.color}` : undefined,
        backgroundColor: urgency?.bg || undefined,
      }}
      className={`todo-item ${done ? 'completed' : ''}`}
    >
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
          onClick={() => todo.memo && setExpandedIds(prev => {
            const next = new Set(prev)
            next.has(todo.id) ? next.delete(todo.id) : next.add(todo.id)
            return next
          })}
          style={{ cursor: todo.memo ? 'pointer' : 'default' }}
        >
          <span className="todo-title">{todo.title}</span>
          <div className="todo-actions">
            {urgency?.badge && (
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                color: urgency.color,
                border: `1px solid ${urgency.color}`,
                padding: '0.1rem 0.4rem',
                borderRadius: '1rem',
                backgroundColor: urgency.bg,
              }}>
                {urgency.badge}
              </span>
            )}
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
          {todo.time && <span className="time-badge">{todo.time}</span>}
          {todo.type === 'date' && todo.startDate && (
            <span className="time-badge">{todo.startDate} ~ {todo.endDate}</span>
          )}
          {todo.type === 'weekly' && todo.selectedDays?.length > 0 && (
            <span className="time-badge">{todo.selectedDays.join(', ')}</span>
          )}
          {todo.type === 'one-time' && todo.dueDate && (
            <span className="time-badge">due {todo.dueDate}</span>
          )}
          {todo.label && (
            <span className="todo-label" style={{ backgroundColor: todo.label.color }}>
              {todo.label.text}
            </span>
          )}
        </div>
        {todo.memo && expandedIds.has(todo.id) && (
          editingMemo ? (
            <textarea
              ref={memoRef}
              className="form-input form-textarea memo-inline-edit"
              value={memoValue}
              onChange={e => setMemoValue(e.target.value)}
              onBlur={saveMemo}
              onKeyDown={e => {
                if (e.key === 'Escape') { e.preventDefault(); cancelMemo() }
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveMemo() }
              }}
              rows={3}
            />
          ) : (
            <div
              className="todo-memo"
              onDoubleClick={e => { e.stopPropagation(); setEditingMemo(true) }}
              title={lang === 'kr' ? '더블클릭으로 수정' : 'Double-click to edit'}
            >
              {formatMemoWithLinks(todo.memo)}
            </div>
          )
        )}
      </div>
    </li>
  )
}

function DroppableFolder({ folder, children, isOver }) {
  const { setNodeRef } = useDroppable({
    id: `folder-${folder.id}`,
    data: { type: 'folder', folderId: folder.id },
  })

  return (
    <div
      ref={setNodeRef}
      className={`folder-drop-zone ${isOver ? 'folder-drop-over' : ''}`}
    >
      {children}
    </div>
  )
}

function FolderSection({ folder, todos, todayStr, activeTab, activePriority, expandedIds, setExpandedIds,
  handleToggle, handleArchive, setEditTodo, lang, folders, setFolders, setTodos, openFolders, setOpenFolders, isOver }) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `folder-${folder.id}`, data: { type: 'folder-sort', folderId: folder.id } })

  const folderDragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const t = getT(lang)
  const isOpen = openFolders.has(folder.id)
  const [editingName, setEditingName] = useState(false)
  const [folderName, setFolderName] = useState(folder.name)

  const isTodayCompleted = (todo) => {
    if (todo.type === 'date') return !!(todo.completions && Object.keys(todo.completions).length > 0)
    return !!(todo.completions?.[todayStr])
  }

const isVisibleToday = (todo) => {
  const today = new Date()
  const dayOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][today.getDay()]
  if (todo.exceptions?.includes(todayStr)) return false
  if (todo.type === 'daily') {
    if (todo.endDate && todayStr > todo.endDate) return false
    return true
  }
  if (todo.type === 'weekly') {
    if (todo.endDate && todayStr > todo.endDate) return false
    return todo.selectedDays?.includes(dayOfWeek)
  }
  if (todo.type === 'date') return todayStr >= todo.startDate && todayStr <= todo.endDate
  if (todo.type === 'one-time') {
    if (!todo.dueDate) return true
    return !(todo.completions?.[todo.dueDate])
  }
  return true
}

  const folderTodos = todos
    .filter(t => t.folderId === folder.id)
    .filter(t => isVisibleToday(t))
    .filter(t => activeTab === 'all' || t.type === activeTab)
    .filter(t => activePriority === 'all' || t.priority === activePriority)
    .sort((a, b) => {
      const aComp = isTodayCompleted(a)
      const bComp = isTodayCompleted(b)
      if (aComp !== bComp) return aComp ? 1 : -1
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    })

  const handleRenameFolder = () => {
    if (!folderName.trim()) return
    setFolders(prev => prev.map(f => f.id === folder.id ? { ...f, name: folderName } : f))
    setEditingName(false)
  }

  const handleDeleteFolder = () => {
    if (folder.isDefault) return
    setTodos(prev => prev.map(t => t.folderId === folder.id ? { ...t, folderId: 'default' } : t))
    setFolders(prev => prev.filter(f => f.id !== folder.id))
  }

  return (
    <div ref={setNodeRef} style={folderDragStyle}>
      <DroppableFolder folder={folder} isOver={isOver}>
        <div className="folder-section">
          <div className="folder-header" onClick={() => setOpenFolders(prev => {
            const next = new Set(prev)
            next.has(folder.id) ? next.delete(folder.id) : next.add(folder.id)
            return next
          })}>
            <div className="folder-header-left">
              <div
                className="todo-drag-handle"
                {...attributes}
                {...listeners}
                onClick={e => e.stopPropagation()}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="5" r="1" fill="currentColor"/><circle cx="15" cy="5" r="1" fill="currentColor"/>
                  <circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/>
                  <circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/>
                </svg>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              {editingName ? (
                <input
                  className="folder-name-input"
                  value={folderName}
                  onChange={e => setFolderName(e.target.value)}
                  onBlur={handleRenameFolder}
                  onKeyDown={e => { if (e.key === 'Enter') handleRenameFolder(); if (e.key === 'Escape') setEditingName(false) }}
                  onClick={e => e.stopPropagation()}
                  autoFocus
                />
              ) : (
                <span className="folder-name">{folder.name}</span>
              )}
              <span className="folder-count">{folderTodos.length}</span>
            </div>
            <div className="folder-header-right" onClick={e => e.stopPropagation()}>
              {!folder.isDefault && (
                <>
                  <button className="folder-action-btn" onClick={() => { setEditingName(true); setOpenFolders(prev => new Set([...prev, folder.id])) }} title="Rename">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button className="folder-action-btn" onClick={handleDeleteFolder} title="Delete folder">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14H6L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {isOpen && (
            <div className="folder-content">
              {folderTodos.length === 0 ? (
                <p className="folder-empty">{t.noTodos}</p>
              ) : (
                <SortableContext items={folderTodos.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  <ul className="todo-items">
                    {folderTodos.map(todo => (
                      <SortableTodoItem
                        key={todo.id}
                        todo={todo}
                        done={isTodayCompleted(todo)}
                        expandedIds={expandedIds}
                        setExpandedIds={setExpandedIds}
                        handleToggle={handleToggle}
                        handleArchive={handleArchive}
                        setEditTodo={setEditTodo}
                        setTodos={setTodos}
                        lang={lang}
                        todayStr={todayStr}
                      />
                    ))}
                  </ul>
                </SortableContext>
              )}
            </div>
          )}
        </div>
      </DroppableFolder>
    </div>
  )
}

function TodoList({ todos, setTodos, folders, setFolders, lang, onOpenSettings }) {
  const t = getT(lang)
  const todayStr = formatDateStr(new Date())
  const [showModal, setShowModal] = useState(false)
  const [editTodo, setEditTodo] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [activePriority, setActivePriority] = useState('all')
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false)
  const [expandedIds, setExpandedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('momo-expanded-ids')
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch { return new Set() }
  })
  const [openFolders, setOpenFolders] = useState(() => {
    try {
      const saved = localStorage.getItem('momo-open-folders')
      return saved ? new Set(JSON.parse(saved)) : new Set(['default'])
    } catch { return new Set(['default']) }
  })
  const [showAddFolder, setShowAddFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [activeDragId, setActiveDragId] = useState(null)
  const [overFolderId, setOverFolderId] = useState(null)
  const dropdownRef = useRef(null)
  const containerRef = useRef(null)

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
    localStorage.setItem('momo-open-folders', JSON.stringify([...openFolders]))
  }, [openFolders])

  useEffect(() => {
    localStorage.setItem('momo-expanded-ids', JSON.stringify([...expandedIds]))
  }, [expandedIds])

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPriorityDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
    }
  }

  const handleDragStart = (event) => {
    setActiveDragId(event.active.id)
  }

  const handleDragOver = (event) => {
  const { over } = event
  if (!over) { setOverFolderId(null); return }
  if (over.data.current?.type === 'folder') {
    setOverFolderId(over.data.current.folderId)
  } else if (over.data.current?.type === 'todo') {
    setOverFolderId(over.data.current.folderId)
  } else if (over.data.current?.type === 'folder-sort') {  // ← 추가
    setOverFolderId(over.data.current.folderId)
  } else {
    setOverFolderId(null)
  }
}

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveDragId(null)
    setOverFolderId(null)

    if (!over) return

    // 폴더 순서 변경
    if (active.data.current?.type === 'folder-sort' && over.data.current?.type === 'folder-sort') {
      const oldIndex = sortedFolders.findIndex(f => `folder-${f.id}` === active.id)
      const newIndex = sortedFolders.findIndex(f => `folder-${f.id}` === over.id)
      if (oldIndex !== newIndex && newIndex !== -1) {
        const reordered = arrayMove(sortedFolders, oldIndex, newIndex)
        setFolders(reordered.map((f, i) => ({ ...f, order: i })))
      }
      return
    }

    const activeTodo = todos.find(t => t.id === active.id)
    if (!activeTodo) return

    const targetFolderId = over.data.current?.type === 'folder'
  ? over.data.current.folderId
  : over.data.current?.type === 'todo'
    ? over.data.current.folderId
  : over.data.current?.type === 'folder-sort'  // ← 추가
    ? over.data.current.folderId
    : null

    if (!targetFolderId) return

    if (activeTodo.folderId !== targetFolderId) {
      setTodos(prev => prev.map(t =>
        t.id === active.id ? { ...t, folderId: targetFolderId } : t
      ))
      setOpenFolders(prev => new Set([...prev, targetFolderId]))
    } else {
      const folderTodos = todos.filter(t => t.folderId === activeTodo.folderId)
      const oldIndex = folderTodos.findIndex(t => t.id === active.id)
      const newIndex = folderTodos.findIndex(t => t.id === over.id)
      if (oldIndex !== newIndex && newIndex !== -1) {
        const reordered = arrayMove(folderTodos, oldIndex, newIndex)
        setTodos(prev => {
          const otherTodos = prev.filter(t => t.folderId !== activeTodo.folderId)
          return [...otherTodos, ...reordered]
        })
      }
    }
  }

  const handleAddFolder = () => {
    if (!newFolderName.trim()) return
    const newFolder = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      order: folders.length,
      isDefault: false,
    }
    setFolders(prev => [...prev, newFolder])
    setOpenFolders(prev => new Set([...prev, newFolder.id]))
    setNewFolderName('')
    setShowAddFolder(false)
  }

  const activeTodo = activeDragId ? todos.find(t => t.id === activeDragId) : null

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

  const sortedFolders = [...folders].sort((a, b) => a.order - b.order)

  const isTodayCompleted = (todo) => {
    if (todo.type === 'date') return !!(todo.completions && Object.keys(todo.completions).length > 0)
    return !!(todo.completions?.[todayStr])
  }

  return (
    <div className="todo-list" ref={containerRef}>
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedFolders.map(f => `folder-${f.id}`)}
          strategy={verticalListSortingStrategy}
        >
          {sortedFolders.map(folder => (
            <FolderSection
              key={folder.id}
              folder={folder}
              todos={todos}
              todayStr={todayStr}
              activeTab={activeTab}
              activePriority={activePriority}
              expandedIds={expandedIds}
              setExpandedIds={setExpandedIds}
              handleToggle={handleToggle}
              handleArchive={handleArchive}
              setEditTodo={setEditTodo}
              lang={lang}
              folders={folders}
              setFolders={setFolders}
              setTodos={setTodos}
              openFolders={openFolders}
              setOpenFolders={setOpenFolders}
              isOver={overFolderId === folder.id}
            />
          ))}
        </SortableContext>

        <DragOverlay>
          {activeTodo ? (
            <ul className="todo-items" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <SortableTodoItem
                todo={activeTodo}
                done={isTodayCompleted(activeTodo)}
                expandedIds={expandedIds}
                setExpandedIds={setExpandedIds}
                handleToggle={() => {}}
                handleArchive={() => {}}
                setEditTodo={() => {}}
                setTodos={() => {}}
                lang={lang}
                isDragOverlay
                todayStr={todayStr}
              />
            </ul>
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="folder-add-row">
        {showAddFolder ? (
          <div className="folder-add-input-row">
            <input
              className="folder-name-input"
              placeholder={lang === 'kr' ? '폴더 이름' : 'Folder name'}
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddFolder(); if (e.key === 'Escape') setShowAddFolder(false) }}
              autoFocus
            />
            <button className="folder-action-btn" onClick={handleAddFolder}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </button>
            <button className="folder-action-btn" onClick={() => setShowAddFolder(false)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        ) : (
          <button className="folder-add-btn" onClick={() => setShowAddFolder(true)}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {lang === 'kr' ? '폴더 추가' : 'Add Folder'}
          </button>
        )}
      </div>

      <button className="add-btn" onClick={() => setShowModal(true)}>
        {t.addTodo}
      </button>

      {showModal && (
        <AddTodoModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
          lang={lang}
          folders={folders}
          defaultFolderId="default"
          allTodos={todos}
          defaultType={activeTab === 'all' ? 'daily' : activeTab}
        />
      )}

      {editTodo && (
        <AddTodoModal
          onClose={() => setEditTodo(null)}
          onAdd={handleEdit}
          initialData={editTodo}
          lang={lang}
          folders={folders}
          allTodos={todos}
        />
      )}
    </div>
  )
}

export default TodoList