import { useState, useRef, useEffect } from 'react'
import { getT } from '../i18n'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const DEFAULT_ALARMS = {
  daily: [{ id: 1, time: '23:30', label: '23:30' }],
  weekly: [{ id: 1, time: '23:30', label: '23:30' }],
  date: [
    { id: 1, daysBefore: 3, time: '12:00', label: '3 days before' },
    { id: 2, daysBefore: 1, time: '12:00', label: '1 day before' },
    { id: 3, daysBefore: 0, time: '12:00', label: 'Day of 12:00' },
    { id: 4, daysBefore: 0, time: '21:00', label: 'Day of 21:00' },
    { id: 5, daysBefore: 0, time: '23:00', label: 'Day of 23:00' },
  ],
  'one-time': [{ id: 1, minutesBefore: 60, label: '1 hour before' }],
}

function AlarmSection({ type, alarmEnabled, setAlarmEnabled, alarms, setAlarms, lang }) {
  const t = getT(lang)

  const handleToggle = () => {
    if (!alarmEnabled) {
      setAlarmEnabled(true)
      if (alarms.length === 0) {
        setAlarms(DEFAULT_ALARMS[type] || [])
      }
    } else {
      setAlarmEnabled(false)
    }
  }

  const handleAddAlarm = () => {
    const newId = Date.now()
    if (type === 'daily' || type === 'weekly') {
      setAlarms(prev => [...prev, { id: newId, time: '09:00', label: '09:00' }])
    } else if (type === 'date') {
      setAlarms(prev => [...prev, { id: newId, daysBefore: 0, time: '09:00', label: 'Day of 09:00' }])
    } else if (type === 'one-time') {
      setAlarms(prev => [...prev, { id: newId, minutesBefore: 60, label: '1 hour before' }])
    }
  }

  const handleRemoveAlarm = (id) => {
    setAlarms(prev => prev.filter(a => a.id !== id))
  }

  const handleUpdateAlarm = (id, updates) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))
  }

  return (
    <div className="alarm-section">
      <div className="alarm-header">
        <span className="form-label">{t.alarmLabel}</span>
        <button
          className={`alarm-toggle-btn ${alarmEnabled ? 'on' : 'off'}`}
          onClick={handleToggle}
        >
          {alarmEnabled ? t.alarmOn : t.alarmOff}
        </button>
      </div>

      {alarmEnabled && (
        <div className="alarm-list">
          {alarms.map(alarm => (
            <div key={alarm.id} className="alarm-item-edit">
              {(type === 'daily' || type === 'weekly') && (
                <input
                  type="time"
                  className="alarm-time-input"
                  value={alarm.time}
                  onChange={e => handleUpdateAlarm(alarm.id, { time: e.target.value, label: e.target.value })}
                />
              )}
              {type === 'date' && (
                <div className="alarm-date-inputs">
                  <select
                    className="alarm-select"
                    value={alarm.daysBefore}
                    onChange={e => handleUpdateAlarm(alarm.id, { daysBefore: parseInt(e.target.value) })}
                  >
                    <option value={0}>{lang === 'kr' ? '당일' : 'Day of'}</option>
                    <option value={1}>{lang === 'kr' ? '1일 전' : '1 day before'}</option>
                    <option value={2}>{lang === 'kr' ? '2일 전' : '2 days before'}</option>
                    <option value={3}>{lang === 'kr' ? '3일 전' : '3 days before'}</option>
                    <option value={7}>{lang === 'kr' ? '7일 전' : '7 days before'}</option>
                  </select>
                  <input
                    type="time"
                    className="alarm-time-input"
                    value={alarm.time}
                    onChange={e => handleUpdateAlarm(alarm.id, { time: e.target.value })}
                  />
                </div>
              )}
              {type === 'one-time' && (
                <select
                  className="alarm-select"
                  value={alarm.minutesBefore}
                  onChange={e => handleUpdateAlarm(alarm.id, { minutesBefore: parseInt(e.target.value) })}
                >
                  <option value={15}>{lang === 'kr' ? '15분 전' : '15 min before'}</option>
                  <option value={30}>{lang === 'kr' ? '30분 전' : '30 min before'}</option>
                  <option value={60}>{lang === 'kr' ? '1시간 전' : '1 hour before'}</option>
                  <option value={120}>{lang === 'kr' ? '2시간 전' : '2 hours before'}</option>
                  <option value={1440}>{lang === 'kr' ? '하루 전' : '1 day before'}</option>
                </select>
              )}
              <button className="alarm-remove-btn" onClick={() => handleRemoveAlarm(alarm.id)}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ))}
          <button className="alarm-add-btn" onClick={handleAddAlarm}>
            {t.alarmAdd}
          </button>
        </div>
      )}
    </div>
  )
}

function AddTodoModal({ onClose, onAdd, initialData, lang, folders, defaultFolderId, allTodos, defaultType }) {
  const t = getT(lang)
  const isEdit = !!initialData
  const [title, setTitle] = useState(initialData?.title || '')
  const [type, setType] = useState(initialData?.type || defaultType || 'daily')
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
  const [alarmEnabled, setAlarmEnabled] = useState(initialData?.alarmEnabled || false)
  const [alarms, setAlarms] = useState(initialData?.alarms || [])
  const folderDropdownRef = useRef(null)
  const labelDropdownRef = useRef(null)

  const existingLabels = (() => {
    if (!allTodos) return []
    const labelMap = {}
    allTodos.forEach(todo => {
      if (todo.label?.text) labelMap[todo.label.text] = todo.label
    })
    return Object.values(labelMap)
  })()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (folderDropdownRef.current && !folderDropdownRef.current.contains(e.target)) setShowFolderDropdown(false)
      if (labelDropdownRef.current && !labelDropdownRef.current.contains(e.target)) setShowLabelDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // type 바뀌면 알람 기본값 리셋
  useEffect(() => {
    if (alarmEnabled) setAlarms(DEFAULT_ALARMS[type] || [])
  }, [type])

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
      alarmEnabled,
      alarms: alarmEnabled ? alarms : [],
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
            <input className="form-input" type="text" placeholder={t.titlePlaceholder} value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          {/* Folder */}
          {folders && folders.length > 0 && (
            <div className="form-group">
              <label className="form-label">{lang === 'kr' ? '폴더' : 'Folder'}</label>
              <div className="todo-dropdown-wrap" ref={folderDropdownRef}>
                <button className="todo-dropdown-btn" onClick={() => setShowFolderDropdown(prev => !prev)}>
                  <span>{selectedFolder?.name || 'Todo!'}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {showFolderDropdown && (
                  <div className="todo-dropdown-list">
                    {folders.map(f => (
                      <button key={f.id} className={`todo-dropdown-item ${folderId === f.id ? 'active' : ''}`}
                        onClick={() => { setFolderId(f.id); setShowFolderDropdown(false) }}>
                        {folderId === f.id && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
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
                <button key={tp.id} className={`btn-option ${type === tp.id ? 'active' : ''}`} onClick={() => setType(tp.id)}>
                  {tp.label}
                </button>
              ))}
            </div>
          </div>

          {type === 'weekly' && (
            <div className="form-group">
              <label className="form-label">{t.daysLabel}</label>
              <div className="btn-group">
                {DAYS.map(day => (
                  <button key={day} className={`btn-option ${selectedDays.includes(day) ? 'active' : ''}`} onClick={() => toggleDay(day)}>
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

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
                <button key={p.id} className={`btn-option priority-${p.id} ${priority === p.id ? 'active' : ''}`} onClick={() => setPriority(p.id)}>
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

          {/* Label */}
          <div className="form-group">
            <label className="form-label">{t.labelLabel}</label>
            <div className="todo-dropdown-wrap" ref={labelDropdownRef}>
              <button className="todo-dropdown-btn" onClick={() => setShowLabelDropdown(prev => !prev)}>
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
                  <button className={`todo-dropdown-item ${labelMode === 'none' ? 'active' : ''}`}
                    onClick={() => { setLabelMode('none'); setLabelText(''); setShowLabelDropdown(false) }}>
                    {labelMode === 'none' && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    None
                  </button>
                  {existingLabels.map(label => (
                    <button key={label.text} className={`todo-dropdown-item ${labelMode === 'existing' && labelText === label.text ? 'active' : ''}`}
                      onClick={() => { setLabelMode('existing'); setLabelText(label.text); setLabelColor(label.color); setShowLabelDropdown(false) }}>
                      {labelMode === 'existing' && labelText === label.text && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      <span style={{ width: '0.7rem', height: '0.7rem', borderRadius: '50%', backgroundColor: label.color, display: 'inline-block', flexShrink: 0 }} />
                      {label.text}
                    </button>
                  ))}
                  <button className={`todo-dropdown-item ${labelMode === 'new' ? 'active' : ''}`}
                    onClick={() => { setLabelMode('new'); setLabelText(''); setShowLabelDropdown(false) }}>
                    {labelMode === 'new' && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    {lang === 'kr' ? '새 라벨' : 'New label'}
                  </button>
                </div>
              )}
            </div>
            {labelMode === 'new' && (
              <div className="label-input-group" style={{ marginTop: '0.4rem' }}>
                <input className="form-input" type="text" placeholder={t.labelPlaceholder} value={labelText} onChange={e => setLabelText(e.target.value)} autoFocus />
                <input className="color-picker" type="color" value={labelColor} onChange={e => setLabelColor(e.target.value)} />
              </div>
            )}
          </div>

          {/* Alarm */}
          <AlarmSection
            type={type}
            alarmEnabled={alarmEnabled}
            setAlarmEnabled={setAlarmEnabled}
            alarms={alarms}
            setAlarms={setAlarms}
            lang={lang}
          />

          {/* Memo */}
          <div className="form-group">
            <label className="form-label">{t.memoLabel}</label>
            <textarea className="form-input form-textarea" placeholder={t.memoPlaceholder} value={memo} onChange={e => setMemo(e.target.value)} rows={3} />
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