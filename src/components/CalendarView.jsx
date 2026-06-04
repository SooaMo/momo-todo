import { useState, useRef, useEffect } from 'react'
import AddTodoModal from './AddTodoModal'
import { getT } from '../i18n'

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const TODO_TYPES = ['daily', 'weekly', 'date', 'one-time']
const ROW_HEIGHT = 1.4 // rem
const DATE_NUM_HEIGHT = 1.4 // rem - 날짜 숫자 높이
const CHIP_HEIGHT = 1.2 // rem - chip 높이
const CHIP_GAP = 0.15 // rem

function formatDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function isCompletedOnDate(todo, dateStr) {
  if (todo.type === 'date') {
    return !!(todo.completions && Object.keys(todo.completions).length > 0)
  }
  return !!(todo.completions?.[dateStr])
}

function getTodosForDate(todos, date, activeTypes) {
  const dateStr = formatDateStr(date)
  const dayOfWeek = DAYS_OF_WEEK[date.getDay()]
  return todos.filter(todo => {
    if (!activeTypes.includes(todo.type)) return false
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

function CalendarView({ todos, setTodos, calView, setCalView, lang, folders }) {
  const t = getT(lang)
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(today)
  const [editTodo, setEditTodo] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeTypes, setActiveTypes] = useState(TODO_TYPES)
  const [showFilter, setShowFilter] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [completionFilter, setCompletionFilter] = useState('active')

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const MONTH_NAMES_EN = ['January','February','March','April','May','June',
    'July','August','September','October','November','December']
  const MONTH_NAMES_KR = ['1월','2월','3월','4월','5월','6월',
    '7월','8월','9월','10월','11월','12월']
  const MONTH_NAMES = lang === 'kr' ? MONTH_NAMES_KR : MONTH_NAMES_EN

  const DAY_LABELS = lang === 'kr'
    ? ['일', '월', '화', '수', '목', '금', '토']
    : DAYS_OF_WEEK

  const toggleType = (type) => {
    setActiveTypes(prev =>
      prev.includes(type)
        ? prev.length === 1 ? prev : prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

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

  const buildDateSpans = (cells, filter) => {
  const dateTodos = todos
  .filter(t => t.type === 'date' && t.startDate && t.endDate && activeTypes.includes('date'))
  .filter(t => {
    const hasAnyCompletion = t.completions && Object.keys(t.completions).length > 0
    if (completionFilter === 'active') return !hasAnyCompletion
    if (completionFilter === 'completed') return hasAnyCompletion
    return true
  })
  .sort((a, b) => {
    const order = { high: 0, mid: 1, low: 2 }
    return (order[a.priority] ?? 1) - (order[b.priority] ?? 1)
  })

    const spans = []
    const rowOccupancy = {}

    dateTodos.forEach(todo => {
      cells.forEach((date, cellIndex) => {
        if (!date) return
        const dateStr = formatDateStr(date)
        if (dateStr < todo.startDate || dateStr > todo.endDate) return
        const isStart = dateStr === todo.startDate || date.getDay() === 0
        if (isStart) {
          let spanLen = 1
          let j = cellIndex + 1
          while (j < cells.length && cells[j]) {
            const nextStr = formatDateStr(cells[j])
            if (nextStr > todo.endDate || cells[j].getDay() === 0) break
            spanLen++
            j++
          }

          let row = 0
          while (true) {
            let rowFree = true
            for (let k = cellIndex; k < cellIndex + spanLen; k++) {
              if (rowOccupancy[k]?.has(row)) { rowFree = false; break }
            }
            if (rowFree) break
            row++
          }

          for (let k = cellIndex; k < cellIndex + spanLen; k++) {
            if (!rowOccupancy[k]) rowOccupancy[k] = new Set()
            rowOccupancy[k].add(row)
          }

          spans.push({ todo, cellIndex, spanLen, isFirstCell: dateStr === todo.startDate, row })
        }
      })
    })
    return { spans, rowOccupancy }
  }

  const cells = buildMonthGrid()
  const { spans: dateSpans, rowOccupancy } = buildDateSpans(cells, completionFilter)
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  // 각 셀마다 date span이 몇 개 row를 차지하는지 계산
  const getMaxRowForCell = (cellIndex) => {
    if (!rowOccupancy[cellIndex]) return 0
    return rowOccupancy[cellIndex].size
  }

  const selectedDateStr = formatDateStr(selectedDate)
  const selectedDayTodos = getTodosForDate(todos, selectedDate, activeTypes)

  const sortedDayTodos = [...selectedDayTodos]
  .filter(todo => {
    const done = isCompletedOnDate(todo, selectedDateStr)
    if (completionFilter === 'active') return !done
    if (completionFilter === 'completed') return done
    return true
  })
  .sort((a, b) => {
    const aDone = isCompletedOnDate(a, selectedDateStr)
    const bDone = isCompletedOnDate(b, selectedDateStr)
    if (aDone !== bDone) return aDone ? 1 : -1
    return 0
  })

  const isAllSelected = activeTypes.length === TODO_TYPES.length

  const filterRef = useRef(null)

useEffect(() => {
  const handleClickOutside = (e) => {
    if (filterRef.current && !filterRef.current.contains(e.target)) {
      setShowFilter(false)
    }
  }
  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [])

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

          <div style={{ position: 'relative' }}>
            <button className="cal-title-btn" onClick={() => setShowDatePicker(prev => !prev)}>
              {calView === 'month'
                ? `${MONTH_NAMES[month]} ${year}`
                : `${getWeekDates()[0].getMonth()+1}/${getWeekDates()[0].getDate()} — ${getWeekDates()[6].getMonth()+1}/${getWeekDates()[6].getDate()}`
              }
            </button>

            {showDatePicker && calView === 'month' && (
              <div className="cal-date-picker">
                <div className="cal-picker-row">
                  <button className="cal-picker-arrow" onClick={() => setCurrentDate(new Date(year - 1, month, 1))}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <span className="cal-picker-value">{year}</span>
                  <button className="cal-picker-arrow" onClick={() => setCurrentDate(new Date(year + 1, month, 1))}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>

                <div className="cal-picker-months">
                  {MONTH_NAMES.map((m, i) => (
                    <button
                      key={i}
                      className={`cal-picker-month ${i === month ? 'active' : ''}`}
                      onClick={() => { setCurrentDate(new Date(year, i, 1)); setShowDatePicker(false) }}
                    >
                      {m.slice(0, 3)}
                    </button>
                  ))}
                </div>

                <button className="cal-picker-today" onClick={() => {
                  setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1))
                  setSelectedDate(today)
                  setShowDatePicker(false)
                }}>
                  Today
                </button>
              </div>
            )}
          </div>

          <button className="cal-nav-btn" onClick={() => {
            if (calView === 'month') setCurrentDate(new Date(year, month + 1, 1))
            else { const d = new Date(selectedDate); d.setDate(d.getDate() + 7); setSelectedDate(d) }
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <div className="cal-right">
          <div className="cal-filter-wrap" ref={filterRef}>
            <button
              className={`cal-filter-btn ${!isAllSelected ? 'active' : ''}`}
              onClick={() => setShowFilter(prev => !prev)}
              title="Filter"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
            </button>
            {showFilter && (
              <div className="cal-filter-dropdown">
                <div className="cal-filter-cols">
                  <div className="cal-filter-col">
                    <span className="cal-filter-col-label">Type</span>
                    {[
                      { id: 'daily', label: t.tabDaily },
                      { id: 'weekly', label: t.tabWeekly },
                      { id: 'date', label: t.tabDate },
                      { id: 'one-time', label: t.tabOneTime },
                    ].map(type => (
                      <button
                        key={type.id}
                        className={`cal-filter-item ${activeTypes.includes(type.id) ? 'active' : ''}`}
                        onClick={() => toggleType(type.id)}
                      >
                        <span className={`cal-filter-check ${activeTypes.includes(type.id) ? 'checked' : ''}`}>
                          {activeTypes.includes(type.id) && (
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </span>
                        {type.label}
                      </button>
                    ))}
                  </div>

                  <div className="cal-filter-divider-v" />

                  <div className="cal-filter-col">
                    <span className="cal-filter-col-label">Status</span>
                    {[
                      { id: 'active', label: t.filterActive },
                      { id: 'completed', label: t.filterCompleted },
                      { id: 'all', label: t.filterAll },
                    ].map(f => (
                      <button
                        key={f.id}
                        className={`cal-filter-item ${completionFilter === f.id ? 'active' : ''}`}
                        onClick={() => setCompletionFilter(f.id)}
                      >
                        <span className={`cal-filter-check ${completionFilter === f.id ? 'checked' : ''}`}>
                          {completionFilter === f.id && (
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </span>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="cal-view-tabs">
            <button className={`cal-view-tab ${calView === 'month' ? 'active' : ''}`} onClick={() => setCalView('month')}>Month</button>
            <button className={`cal-view-tab ${calView === 'week' ? 'active' : ''}`} onClick={() => setCalView('week')}>Week</button>
          </div>
        </div>
      </div>

      {/* Month view */}
      {calView === 'month' && (
        <div className="month-view">
          <div className="month-grid-header">
            {DAY_LABELS.map(d => (
              <div key={d} className="month-day-label">{d}</div>
            ))}
          </div>
          {weeks.map((week, weekIdx) => {
            const weekStartIndex = weekIdx * 7

            // 이번 주의 최대 date span row 수 계산
            const maxSpanRows = Math.max(0, ...week.map((_, i) => getMaxRowForCell(weekStartIndex + i)))

            const weekSpans = dateSpans.filter(({ todo }) => {
                if (completionFilter === 'all') return true
                // 기간 중 한번이라도 체크했는지 확인
                const hasAnyCompletion = todo.completions && Object.keys(todo.completions).length > 0
                if (completionFilter === 'active') return !hasAnyCompletion
                if (completionFilter === 'completed') return hasAnyCompletion
                return true
              })

            // date span들이 차지하는 높이
            const spanAreaHeight = maxSpanRows > 0 ? DATE_NUM_HEIGHT + maxSpanRows * ROW_HEIGHT + 0.2 : DATE_NUM_HEIGHT

            return (
              <div key={weekIdx} className="month-week-row">
                <div className="month-week-dates">
                  {week.map((date, i) => {
                    if (!date) return <div key={i} className="month-cell empty" style={{ minHeight: `${spanAreaHeight + 2.5}rem` }} />
                    const dateStr = formatDateStr(date)
                    const isToday = isSameDay(date, today)
                    const isSelected = isSameDay(date, selectedDate)
                    const regularTodos = getTodosForDate(todos, date, activeTypes)
                        .filter(t => t.type !== 'date')
                        .filter(t => {
                          if (completionFilter === 'active') return !isCompletedOnDate(t, dateStr)
                          if (completionFilter === 'completed') return isCompletedOnDate(t, dateStr)
                          return true
                        })
                    const maxSpanRowsForCell = getMaxRowForCell(weekStartIndex + i)
                    const TOTAL_LIMIT = 5
                    const availableChipSlots = Math.max(0, TOTAL_LIMIT - maxSpanRowsForCell)
                    const visibleChips = regularTodos.slice(0, availableChipSlots)
                    const hiddenCount = (regularTodos.length - visibleChips.length)
                    return (
                      <div
                        key={i}
                        className={`month-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                        style={{ minHeight: `${spanAreaHeight + 2.5}rem` }}
                        onClick={() => { setSelectedDate(date); setCalView('week') }}
                      >
                        <span className="month-cell-date">{date.getDate()}</span>
                        {/* date span 자리만큼 빈 공간 */}
                      <div style={{ height: `${maxSpanRows > 0 ? maxSpanRows * ROW_HEIGHT + 0.2 : 0}rem` }} />
                        <div className="month-cell-chips">
                          {visibleChips.map(todo => {
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
                          {hiddenCount > 0 && (
                            <span className="month-more">+{hiddenCount}</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                {weekSpans.map(({ todo, cellIndex, spanLen, isFirstCell, row }) => {
                  const localIndex = cellIndex - weekStartIndex
                  const color = getTodoColor(todo)
                  const firstDateOfSpanInWeek = week[localIndex]
                  const done = firstDateOfSpanInWeek ? isCompletedOnDate(todo, formatDateStr(firstDateOfSpanInWeek)) : false
                  return (
                    <div key={`${todo.id}-${cellIndex}`} className="month-span-bar" style={{
                        left: `calc(${localIndex / 7 * 100}% + 0.1rem)`,
                        width: `calc(${spanLen / 7 * 100}% - 0.2rem)`,
                        top: `calc(${DATE_NUM_HEIGHT + row * ROW_HEIGHT}rem)`,
                        backgroundColor: color + '50',
                        borderLeft: isFirstCell ? `2.5px solid ${color}` : 'none',
                        borderRadius: isFirstCell
                          ? (localIndex + spanLen >= 7 ? '0.2rem 0 0 0.2rem' : '0.2rem')
                          : (localIndex + spanLen >= 7 ? '0' : '0 0.2rem 0.2rem 0'),
                        opacity: done ? 0.45 : 1,
                      }}>
                      {(isFirstCell || localIndex === 0) && (
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
      )}

      {/* Week view */}
      {calView === 'week' && (
        <div className="week-view">
          <div className="week-grid">
            {getWeekDates().map((date, i) => {
              const dayTodos = getTodosForDate(todos, date, activeTypes)
              const isToday = isSameDay(date, today)
              const isSelected = isSameDay(date, selectedDate)
              return (
                <div
                  key={i}
                  className={`week-day-col ${isToday ? 'today' : ''} ${isSelected ? 'week-selected' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="week-day-header">
                    <span className="week-day-name">{DAY_LABELS[date.getDay()]}</span>
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
                {selectedDate.getMonth()+1}/{selectedDate.getDate()} ({DAY_LABELS[selectedDate.getDay()]})
              </span>
            </div>
            {sortedDayTodos.length === 0 ? (
              <p className="empty-text" style={{ marginTop: '1rem' }}>{t.noTodosDay}</p>
            ) : (
              <ul className="todo-items">
                {sortedDayTodos.map(todo => {
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
                          <span className={`priority-badge priority-${todo.priority}`}>
                            {todo.priority === 'high' ? t.priorityHigh : todo.priority === 'mid' ? t.priorityMid : t.priorityLow}
                          </span>
                          <span className="type-badge">
                            {todo.type === 'daily' ? t.tabDaily : todo.type === 'weekly' ? t.tabWeekly : todo.type === 'date' ? t.tabDate : t.tabOneTime}
                          </span>
                          {todo.time && <span className="time-badge">{todo.time}</span>}
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
      )}

      {editTodo && (
        <AddTodoModal onClose={() => setEditTodo(null)} onAdd={handleEdit} initialData={editTodo} lang={lang} />
      )}

      {/* Floating + button */}
<button
  className="cal-fab-btn"
  onClick={() => setShowAddModal(true)}
>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
</button>

{showAddModal && (
  <AddTodoModal
    onClose={() => setShowAddModal(false)}
    onAdd={(todo) => setTodos(prev => [...prev, todo])}
    lang={lang}
    folders={folders}
    defaultFolderId="default"
    allTodos={todos}
  />
)}

    </div>
  )
}

export default CalendarView