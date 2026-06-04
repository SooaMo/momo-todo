import { useState, useRef, useEffect } from 'react'
import { getT } from '../i18n'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function AddTodoModal({ onClose, onAdd, initialData, lang, folders, defaultFolderId, allTodos }) {
  const t = getT(lang)
  const isEdit = !!initialData
  const [title, setTitle] = useState(initialData?.title || '')
  const [type, setType] = useState(initialData?.type || 'daily')
  const [priority, setPriority] = useState(initialData?.priority || 'mid')
  const [time, setTime] = useState(initialData?.time || '')
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '')
  const [startDate, setStartDate] = useState(initialData?.startDate || '')
  const [endDate, setEndDate] = useState(initialData?.endDate || '')
  const [selectedDays, setSelectedDays] = useState(initialData?.selectedDays || [])
  const [labelText, setLabelText] = useState(initialData?.label?.text || '')
  const [labelColor, setLabelColor] = useState(initialData?.label?.color || '#DC9B9B')
  const [memo, setMemo] = useState(initialData?.memo || '')
  const [folderId, setFolderId] = useState(initialData?.folderId || defaultFolderId || 'default')
  const [showFolderDropdown, setShowFolderDropdown] = useState(false)
  const [showLabelDropdown, setShowLabelDropdown] = useState(false)
  const [labelMode, setLabelMode] = useState(initialData?.label ? 'existing' : 'none')
  const folderDropdownRef = useRef(null)
  const labelDropdownRef = useRef(null)

  // 기존 라벨 목록 추출
  const existingLabels = (() => {
    if (!allTodos) return []
    const labelMap = {}
    allTodos.forEach(todo => {
      if (todo.label?.text) {
        labelMap[todo.label.text] = todo.label
      }
    })
    return Object.values(labelMap)
  })()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (folderDropdownRef.current && !folderDropdownRef.current.contains(e.target)) {
        setShowFolderDropdown(false)
      }
      if (labelDropdownRef.current && !labelDropdownRef.current.contains(e.target)) {
        setShowLabelDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const selectedFolder = folders?.find(f => f.id === folderId)
  const labelDisplay = labelMode === 'none' ? 'None'
    : labelMode === 'new' ? (labelText || 'New label...')
    : labelText || 'None'

  const handleSubmit = () => {
    if (!title.trim()) return
    const todo = {
      id: initialData?.id || Date.now(),
      title,
      type,
      priority,
      time: time || null,
      dueDate: type === 'one-time' ? dueDate : null,
      startDate: type === 'date' ? startDate : null,
      endDate: type === 'date' ? endDate : null,
      selectedDays: type === 'weekly' ? selectedDays : [],
      label: labelMode !== 'none' && labelText ? { text: labelText, color: labelColor } : null,
      memo: memo || null,
      completed: initialData?.completed || false,
      completions: initialData?.completions || {},
      createdAt: initialData?.createdAt || new Date().toISOString(),
      folderId: folderId || 'default',
    }
    onAdd(todo)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? t.editTodoTitle : t.addTodoTitle}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Title */}
          <div className="form-group">
            <label className="form-label">{t.titleLabel}</label>
            <input
              className="form-input"
              type="text"
              placeholder={t.titlePlaceholder}
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          {/* Folder dropdown */}
          {folders && folders.length > 0 && (
            <div className="form-group">
              <label className="form-label">{lang === 'kr' ? '폴더' : 'Folder'}</label>
              <div className="todo-dropdown-wrap" ref={folderDropdownRef}>
                <button
                  className="todo-dropdown-btn"
                  onClick={() => setShowFolderDropdown(prev => !prev)}
                >
                  <span>{selectedFolder?.name || 'Todo!'}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {showFolderDropdown && (
                  <div className="todo-dropdown-list">
                    {folders.map(f => (
                      <button
                        key={f.id}
                        className={`todo-dropdown-item ${folderId === f.id ? 'active' : ''}`}
                        onClick={() => { setFolderId(f.id); setShowFolderDropdown(false) }}
                      >
                        {folderId === f.id && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                        {f.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Type */}
          <div className="form-group">
            <label className="form-label">{t.typeLabel}</label>
            <div className="btn-group">
              {[
                { id: 'daily', label: t.tabDaily },
                { id: 'weekly', label: t.tabWeekly },
                { id: 'date', label: t.tabDate },
                { id: 'one-time', label: t.tabOneTime },
              ].map(tp => (
                <button
                  key={tp.id}
                  className={`btn-option ${type === tp.id ? 'active' : ''}`}
                  onClick={() => setType(tp.id)}
                >
                  {tp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Days (weekly) */}
          {type === 'weekly' && (
            <div className="form-group">
              <label className="form-label">{t.daysLabel}</label>
              <div className="btn-group">
                {DAYS.map(day => (
                  <button
                    key={day}
                    className={`btn-option ${selectedDays.includes(day) ? 'active' : ''}`}
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date range */}
          {type === 'date' && (
            <div className="form-group">
              <label className="form-label">{t.dateRangeLabel}</label>
              <div className="date-range">
                <input className="form-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                <span className="date-separator">~</span>
                <input className="form-input" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            </div>
          )}

          {/* Due date (one-time) */}
          {type === 'one-time' && (
            <div className="form-group">
              <label className="form-label">{t.dueDateLabel}</label>
              <input className="form-input" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          )}

          {/* Priority */}
          <div className="form-group">
            <label className="form-label">{t.priorityLabel}</label>
            <div className="btn-group">
              {[
                { id: 'high', label: t.priorityHigh },
                { id: 'mid', label: t.priorityMid },
                { id: 'low', label: t.priorityLow },
              ].map(p => (
                <button
                  key={p.id}
                  className={`btn-option priority-${p.id} ${priority === p.id ? 'active' : ''}`}
                  onClick={() => setPriority(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="form-group">
            <label className="form-label">{t.timeLabel}</label>
            <input className="form-input" type="time" value={time} onChange={e => setTime(e.target.value)} />
          </div>

          {/* Label dropdown */}
          <div className="form-group">
            <label className="form-label">{t.labelLabel}</label>
            <div className="todo-dropdown-wrap" ref={labelDropdownRef}>
              <button
                className="todo-dropdown-btn"
                onClick={() => setShowLabelDropdown(prev => !prev)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {labelMode !== 'none' && labelText && (
                    <span style={{ width: '0.7rem', height: '0.7rem', borderRadius: '50%', backgroundColor: labelColor, display: 'inline-block' }} />
                  )}
                  {labelDisplay}
                </span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {showLabelDropdown && (
                <div className="todo-dropdown-list">
                  {/* None */}
                  <button
                    className={`todo-dropdown-item ${labelMode === 'none' ? 'active' : ''}`}
                    onClick={() => { setLabelMode('none'); setLabelText(''); setShowLabelDropdown(false) }}
                  >
                    {labelMode === 'none' && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                    None
                  </button>

                  {/* 기존 라벨들 */}
                  {existingLabels.map(label => (
                    <button
                      key={label.text}
                      className={`todo-dropdown-item ${labelMode === 'existing' && labelText === label.text ? 'active' : ''}`}
                      onClick={() => {
                        setLabelMode('existing')
                        setLabelText(label.text)
                        setLabelColor(label.color)
                        setShowLabelDropdown(false)
                      }}
                    >
                      {labelMode === 'existing' && labelText === label.text && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                      <span style={{ width: '0.7rem', height: '0.7rem', borderRadius: '50%', backgroundColor: label.color, display: 'inline-block', flexShrink: 0 }} />
                      {label.text}
                    </button>
                  ))}

                  {/* New label */}
                  <button
                    className={`todo-dropdown-item ${labelMode === 'new' ? 'active' : ''}`}
                    onClick={() => { setLabelMode('new'); setLabelText(''); setShowLabelDropdown(false) }}
                  >
                    {labelMode === 'new' && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    {lang === 'kr' ? '새 라벨' : 'New label'}
                  </button>
                </div>
              )}
            </div>

            {/* New label input */}
            {labelMode === 'new' && (
              <div className="label-input-group" style={{ marginTop: '0.4rem' }}>
                <input
                  className="form-input"
                  type="text"
                  placeholder={t.labelPlaceholder}
                  value={labelText}
                  onChange={e => setLabelText(e.target.value)}
                  autoFocus
                />
                <input
                  className="color-picker"
                  type="color"
                  value={labelColor}
                  onChange={e => setLabelColor(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Memo */}
          <div className="form-group">
            <label className="form-label">{t.memoLabel}</label>
            <textarea
              className="form-input form-textarea"
              placeholder={t.memoPlaceholder}
              value={memo}
              onChange={e => setMemo(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>{t.cancel}</button>
          <button className="btn-submit" onClick={handleSubmit} disabled={!title.trim()}>
            {isEdit ? t.save : t.add}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddTodoModal