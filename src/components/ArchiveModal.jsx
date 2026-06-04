import { useState } from 'react'
import { getT } from '../i18n'

const ARCHIVE_KEY = 'momo-archive'

function loadArchive() {
  try {
    const saved = localStorage.getItem(ARCHIVE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function saveToArchive(todo) {
  const archive = loadArchive()
  const archived = {
    ...todo,
    archivedAt: new Date().toISOString(),
  }
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify([archived, ...archive]))
}

function ArchiveModal({ onClose, onRestore, lang }) {
  const t = getT(lang)
  const [archive, setArchive] = useState(loadArchive)

  const handleDelete = (id) => {
    const updated = archive.filter(t => t.id !== id)
    setArchive(updated)
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(updated))
  }

  const handleRestore = (todo) => {
    const restored = { ...todo }
    delete restored.archivedAt
    onRestore(restored)
    const updated = archive.filter(t => t.id !== todo.id)
    setArchive(updated)
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(updated))
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t.archive}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          {archive.length === 0 ? (
            <p className="empty-text" style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
              {t.archiveEmpty}
            </p>
          ) : (
            <ul className="todo-items">
              {archive.map(todo => (
                <li key={todo.id} className="todo-item archive-item">
                  <div className="todo-info">
                    <div className="todo-title-row">
                      <span className="todo-title archive-title">{todo.title}</span>
                      <div className="todo-actions">
                        <button className="todo-restore" onClick={() => handleRestore(todo)} title="Restore">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                            <path d="M3 3v5h5"/>
                          </svg>
                        </button>
                        <button className="todo-delete" onClick={() => handleDelete(todo.id)} title="Delete permanently">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14H6L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4h6v2"/>
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
                      <span className="time-badge">{formatDate(todo.archivedAt)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default ArchiveModal