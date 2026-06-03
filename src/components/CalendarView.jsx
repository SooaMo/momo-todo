import { useState } from 'react'
import AddTodoModal from './AddTodoModal'
import BannerImage from './BannerImage'

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function isCompletedOnDate(todo, dateStr) {
  return !!(todo.completions?.[dateStr])
}

function getTodosForDate(todos, date) {
  const dateStr = formatDateStr(date)
  const dayOfWeek = DAYS_OF_WEEK[date.getDay()]
  return todos.filter(todo => {
    if (todo.type === 'daily') return true
    if (todo.type === 'weekly') return todo.selectedDays?.includes(dayOfWeek)
    if (todo.type === 'date') return todo.startDate && todo.endDate && dateStr >= todo.startDate && dateStr <= todo.endDate
    if (todo.type === 'one-time') return todo.dueDate === dateStr
    return false
  })
}

function getTodoColor(todo) {
  return todo.label?.color || '#94bba9'
}

function getDateSpanType(todo, date) {
  if (todo.type !== 'date') return null
  const dateStr = formatDateStr(date)
  if (dateStr === todo.startDate && dateStr === todo.endDate) return 'single'
  if (dateStr === todo.startDate) return 'start'
  if (dateStr === todo.endDate) return 'end'
  return 'middle'
}

function CalendarView({ todos, setTodos }) {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [calView, setCalView] = useState('month')
  const [selectedDate, setSelectedDate] = useState(today)
  const [editTodo, setEditTodo] = useState(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const MONTH_NAMES = ['January','February','March','April','May','June',
    'July','August','September','October','November','December']

  const getWeekDates = () => {
    const start = new Date(selectedDate)
    start.setDate(start.getDate() - start.getDay())
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      return d
    })
  }

  const handleToggleOnDate = (todoId, dateStr) => {
    setTodos(prev => prev.map(t => {
      if (t.id !== todoId) return t
      const completions = { ...t.completions }
      if (completions[dateStr]) delete completions[dateStr]
      else completions[dateStr] = true
      return { ...t, completions }
    }))
  }

  const handleEdit = (updated) => {
    setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  const buildMonthGrid = () => {
    const cells = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let i = 1; i <= daysInMonth; i++) cells.push(new Date(year, month, i))
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }

  const buildDateSpans = (cells) => {
    const dateTodos = todos.filter(t => t.type === 'date' && t.startDate && t.endDate)
    const spans = []
    dateTodos.forEach(todo => {
      cells.forEach((date, cellIndex) => {
        if (!date) return
        const dateStr = formatDateStr(date)
        if (dateStr < todo.startDate || dateStr > todo.endDate) return
        const isStart = dateStr === todo.startDate || date.getDay() === 0
        const isEnd = dateStr === todo.endDate || date.getDay() === 6
        if (isStart) {
          let spanLen = 1
          let j = cellIndex + 1
          while (j < cells.length && cells[j]) {
            const nextStr = formatDateStr(cells[j])
            if (nextStr > todo.endDate || cells[j].getDay() === 0) break
            spanLen++
            j++
          }
          spans.push({ todo, cellIndex, spanLen, isFirstCell: dateStr === todo.startDate })
        }
      })
    })
    return spans
  }

  const cells = buildMonthGrid()
  const dateSpans = buildDateSpans(cells)
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  const selectedDateStr = formatDateStr(selectedDate)
  const selectedDayTodos = getTodosForDate(todos, selectedDate)

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={() => {
            if (calView === 'month') setCurrentDate(new Date(year, month - 1, 1))
            else { const d = new Date(selectedDate); d.setDate(d.getDate() - 7); setSelectedDate(d) }
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span className="cal-title">
            {calView === 'month'
              ? `${MONTH_NAMES[month]} ${year}`
              : `${getWeekDates()[0].getMonth()+1}/${getWeekDates()[0].getDate()} — ${getWeekDates()[6].getMonth()+1}/${getWeekDates()[6].getDate()}`
            }
          </span>
          <button className="cal-nav-btn" onClick={() => {
            if (calView === 'month') setCurrentDate(new Date(year, month + 1, 1))
            else { const d = new Date(selectedDate); d.setDate(d.getDate() + 7); setSelectedDate(d) }
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
        <div className="cal-view-tabs">
          <button className={`cal-view-tab ${calView === 'month' ? 'active' : ''}`} onClick={() => setCalView('month')}>Month</button>
          <button className={`cal-view-tab ${calView === 'week' ? 'active' : ''}`} onClick={() => setCalView('week')}>Week</button>
        </div>
      </div>

      {/* Month view */}
      {calView === 'month' && (
        <>
          <div className="month-view">
            <div className="month-grid-header">
              {DAYS_OF_WEEK.map(d => (
                <div key={d} className="month-day-label">{d}</div>
              ))}
            </div>
            {weeks.map((week, weekIdx) => {
              const weekStartIndex = weekIdx * 7
              const weekSpans = dateSpans.filter(s =>
                s.cellIndex >= weekStartIndex && s.cellIndex < weekStartIndex + 7
              )
              return (
                <div key={weekIdx} className="month-week-row">
                  <div className="month-week-dates">
                    {week.map((date, i) => {
                      if (!date) return <div key={i} className="month-cell empty" />
                      const dateStr = formatDateStr(date)
                      const isToday = isSameDay(date, today)
                      const isSelected = isSameDay(date, selectedDate)
                      const regularTodos = getTodosForDate(todos, date).filter(t => t.type !== 'date')
                      return (
                        <div
                          key={i}
                          className={`month-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                          onClick={() => { setSelectedDate(date); setCalView('week') }}
                        >
                          <span className="month-cell-date">{date.getDate()}</span>
                          <div className="month-cell-chips">
                            {regularTodos.slice(0, 2).map(todo => {
                              const done = isCompletedOnDate(todo, dateStr)
                              const color = getTodoColor(todo)
                              return (
                                <div key={todo.id} className="month-todo-chip" style={{
                                  backgroundColor: color + '35',
                                  borderLeft: `2px solid ${color}`,
                                  textDecoration: done ? 'line-through' : 'none',
                                  opacity: done ? 0.5 : 1,
                                }}>
                                  <span className="month-todo-chip-title">{todo.title}</span>
                                </div>
                              )
                            })}
                            {regularTodos.length > 2 && (
                              <span className="month-more">+{regularTodos.length - 2}</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {weekSpans.map(({ todo, cellIndex, spanLen, isFirstCell }) => {
                    const localIndex = cellIndex - weekStartIndex
                    const color = getTodoColor(todo)
                    const firstDateOfSpanInWeek = week[localIndex]
                    const done = firstDateOfSpanInWeek ? isCompletedOnDate(todo, formatDateStr(firstDateOfSpanInWeek)) : false
                    return (
                      <div key={`${todo.id}-${cellIndex}`} className="month-span-bar" style={{
                        left: `calc(${localIndex / 7 * 100}% + 0.1rem)`,
                        width: `calc(${spanLen / 7 * 100}% - 0.2rem)`,
                        backgroundColor: color + '50',
                        borderLeft: isFirstCell ? `2.5px solid ${color}` : 'none',
                        opacity: done ? 0.45 : 1,
                      }}>
                        {isFirstCell && (
                          <span className="month-span-title" style={{ textDecoration: done ? 'line-through' : 'none' }}>
                            {todo.title}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
          <BannerImage imageKey="momo-banner-calendar-month-bottom" className="banner-bottom" />
        </>
      )}

      {/* Week view */}
      {calView === 'week' && (
        <>
          <div className="week-view">
            <div className="week-grid">
              {getWeekDates().map((date, i) => {
                const dayTodos = getTodosForDate(todos, date)
                const isToday = isSameDay(date, today)
                const isSelected = isSameDay(date, selectedDate)
                return (
                  <div
                    key={i}
                    className={`week-day-col ${isToday ? 'today' : ''} ${isSelected ? 'week-selected' : ''}`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="week-day-header">
                      <span className="week-day-name">{DAYS_OF_WEEK[date.getDay()]}</span>
                      <span className={`week-day-num ${isToday ? 'today' : ''}`}>{date.getDate()}</span>
                      {dayTodos.length > 0 && (
                        <span className="week-dot-count">{dayTodos.length}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="day-checklist">
              <div className="day-checklist-header">
                <span className="day-checklist-title">
                  {selectedDate.getMonth()+1}/{selectedDate.getDate()} ({DAYS_OF_WEEK[selectedDate.getDay()]})
                </span>
              </div>
              {selectedDayTodos.length === 0 ? (
                <p className="empty-text" style={{ marginTop: '1rem' }}>No todos for this day.</p>
              ) : (
                <ul className="todo-items">
                  {selectedDayTodos.map(todo => {
                    const done = isCompletedOnDate(todo, selectedDateStr)
                    const color = getTodoColor(todo)
                    return (
                      <li key={todo.id} className={`todo-item ${done ? 'completed' : ''}`}
                        style={{ borderLeft: `3px solid ${color}` }}>
                        <button className="todo-check" onClick={() => handleToggleOnDate(todo.id, selectedDateStr)}>
                          {done ? '✓' : ''}
                        </button>
                        <div className="todo-info">
                          <div className="todo-title-row">
                            <span className="todo-title">{todo.title}</span>
                            <button className="todo-edit" onClick={() => setEditTodo(todo)}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </button>
                          </div>
                          <div className="todo-meta">
                            <span className={`priority-badge priority-${todo.priority}`}>{todo.priority}</span>
                            <span className="type-badge">{todo.type}</span>
                            {todo.time && <span className="time-badge">⏰ {todo.time}</span>}
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
            </div>
          </div>
          <BannerImage imageKey="momo-banner-calendar-week-bottom" className="banner-bottom" />
        </>
      )}

      {editTodo && (
        <AddTodoModal onClose={() => setEditTodo(null)} onAdd={handleEdit} initialData={editTodo} />
      )}
    </div>
  )
}

export default CalendarView