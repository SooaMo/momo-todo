import { useState } from 'react'
import { getT } from '../i18n'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function AddTodoModal({ onClose, onAdd, initialData, lang }) {
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

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

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
      label: labelText ? { text: labelText, color: labelColor } : null,
      memo: memo || null,
      completed: initialData?.completed || false,
      completions: initialData?.completions || {},
      createdAt: initialData?.createdAt || new Date().toISOString(),
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

          <div className="form-group">
            <label className="form-label">{t.timeLabel}</label>
            <input className="form-input" type="time" value={time} onChange={e => setTime(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">{t.labelLabel}</label>
            <div className="label-input-group">
              <input
                className="form-input"
                type="text"
                placeholder={t.labelPlaceholder}
                value={labelText}
                onChange={e => setLabelText(e.target.value)}
              />
              <input
                className="color-picker"
                type="color"
                value={labelColor}
                onChange={e => setLabelColor(e.target.value)}
              />
            </div>
          </div>

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