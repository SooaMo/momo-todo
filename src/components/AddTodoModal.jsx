import { useState } from 'react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function AddTodoModal({ onClose, onAdd, initialData }) {
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
      completed: initialData?.completed || false,
      createdAt: initialData?.createdAt || new Date().toISOString(),
    }
    onAdd(todo)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Todo' : 'Add Todo'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              className="form-input"
              type="text"
              placeholder="What do you need to do?"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Type</label>
            <div className="btn-group">
              {['daily', 'weekly', 'date', 'one-time'].map(t => (
                <button
                  key={t}
                  className={`btn-option ${type === t ? 'active' : ''}`}
                  onClick={() => setType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {type === 'weekly' && (
            <div className="form-group">
              <label className="form-label">Days</label>
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
              <label className="form-label">Date Range</label>
              <div className="date-range">
                <input className="form-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                <span className="date-separator">~</span>
                <input className="form-input" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            </div>
          )}

          {type === 'one-time' && (
            <div className="form-group">
              <label className="form-label">Due Date (optional)</label>
              <input className="form-input" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Priority</label>
            <div className="btn-group">
              {['high', 'mid', 'low'].map(p => (
                <button
                  key={p}
                  className={`btn-option priority-${p} ${priority === p ? 'active' : ''}`}
                  onClick={() => setPriority(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Time (optional)</label>
            <input className="form-input" type="time" value={time} onChange={e => setTime(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Label (optional)</label>
            <div className="label-input-group">
              <input
                className="form-input"
                type="text"
                placeholder="Label name"
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
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-submit" onClick={handleSubmit} disabled={!title.trim()}>
            {isEdit ? 'Save' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddTodoModal