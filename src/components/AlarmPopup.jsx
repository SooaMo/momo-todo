import { useState, useEffect } from 'react'

export function useAlarmChecker(todos, lang) {
  const [dismissedAlarms, setDismissedAlarms] = useState(() => {
    try {
      const saved = localStorage.getItem('momo-dismissed-alarms')
      return saved ? JSON.parse(saved) : {}
    } catch { return {} }
  })

  const getAlarmKey = (todoId, alarmType) => `${todoId}-${alarmType}`

  const isDismissed = (todoId, alarmType) => {
    const key = getAlarmKey(todoId, alarmType)
    const dismissedAt = dismissedAlarms[key]
    if (!dismissedAt) return false
    const today = new Date().toDateString()
    return new Date(dismissedAt).toDateString() === today
  }

  const formatDateStr = (date) =>
    `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`

  const checkAlarms = () => {
    const now = new Date()
    const todayStr = formatDateStr(now)
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const timeStr = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}`
    const dayOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][now.getDay()]

    const newAlarms = []

    todos.forEach(todo => {
      const isCompletedToday = todo.type === 'date'
        ? !!(todo.completions && Object.keys(todo.completions).length > 0)
        : !!(todo.completions?.[todayStr])

      // 커스텀 알람이 설정된 경우
      if (todo.alarmEnabled && todo.alarms && todo.alarms.length > 0) {
        todo.alarms.forEach(alarm => {
          const alarmKey = `custom-${alarm.id}`

          if (todo.type === 'daily' || todo.type === 'weekly') {
            if (todo.type === 'weekly' && !todo.selectedDays?.includes(dayOfWeek)) return
            if (timeStr === alarm.time && !isCompletedToday && !isDismissed(todo.id, alarmKey)) {
              newAlarms.push({
                title: todo.title,
                message: lang === 'kr' ? '아직 완료하지 않았어요!' : 'Not completed yet!',
                todoId: todo.id,
                alarmType: alarmKey,
              })
            }
          }

          if (todo.type === 'date' && todo.endDate) {
            const endDate = new Date(todo.endDate + 'T23:59:00')
            const diffDays = Math.floor((endDate - now) / (1000 * 60 * 60 * 24))
            if (diffDays === alarm.daysBefore && timeStr === alarm.time && !isCompletedToday && !isDismissed(todo.id, alarmKey)) {
              const msg = alarm.daysBefore === 0
                ? (lang === 'kr' ? '오늘이 마감이에요!' : 'Deadline is today!')
                : (lang === 'kr' ? `마감 ${alarm.daysBefore}일 전이에요!` : `${alarm.daysBefore} day(s) until deadline!`)
              newAlarms.push({
                title: todo.title,
                message: msg,
                todoId: todo.id,
                alarmType: alarmKey,
              })
            }
          }

          if (todo.type === 'one-time' && todo.dueDate) {
                const [year, month, day] = todo.dueDate.split('-').map(Number)
                const dueDate = new Date(year, month - 1, day)
                if (todo.time) {
                    const [h, m] = todo.time.split(':').map(Number)
                    dueDate.setHours(h, m, 0, 0)
                } else {
                    dueDate.setHours(23, 59, 0, 0)
                }
            const diffMins = Math.floor((dueDate - now) / (1000 * 60))
            const target = alarm.minutesBefore
            if (diffMins >= target - 5 && diffMins <= target + 5 && !isCompletedToday && !isDismissed(todo.id, alarmKey)) {
              newAlarms.push({
                title: todo.title,
                message: lang === 'kr' ? `${target >= 60 ? `${target/60}시간` : `${target}분`} 후 마감이에요!` : `Due in ${target >= 60 ? `${target/60}h` : `${target}min`}!`,
                todoId: todo.id,
                alarmType: alarmKey,
              })
            }
          }
        })
        return // 커스텀 알람 있으면 기본 알람 스킵
      }

      // 기본 알람 (alarmEnabled가 없거나 false인 경우 - 기본 동작)
      if (todo.alarmEnabled === false) return // 명시적으로 끈 경우 스킵

      if (todo.type === 'daily') {
        if (timeStr === '23:30' && !isCompletedToday && !isDismissed(todo.id, 'daily-2330')) {
          newAlarms.push({
            title: todo.title,
            message: lang === 'kr' ? '오늘 아직 완료하지 않았어요!' : 'Not completed yet today!',
            todoId: todo.id,
            alarmType: 'daily-2330',
          })
        }
      }

      if (todo.type === 'weekly' && todo.selectedDays?.includes(dayOfWeek)) {
        if (timeStr === '23:30' && !isCompletedToday && !isDismissed(todo.id, 'weekly-2330')) {
          newAlarms.push({
            title: todo.title,
            message: lang === 'kr' ? '오늘 아직 완료하지 않았어요!' : 'Not completed yet today!',
            todoId: todo.id,
            alarmType: 'weekly-2330',
          })
        }
      }

      if (todo.type === 'date' && todo.endDate) {
        const endDate = new Date(todo.endDate + 'T23:59:00')
        const diffDays = Math.floor((endDate - now) / (1000 * 60 * 60 * 24))

        const dateAlarms = [
          { days: 3, time: '12:00', key: 'date-3d', msgKr: '마감 3일 전이에요!', msgEn: '3 days until deadline!' },
          { days: 1, time: '12:00', key: 'date-1d', msgKr: '내일이 마감이에요!', msgEn: 'Deadline is tomorrow!' },
          { days: 0, time: '12:00', key: 'date-today-12', msgKr: '오늘이 마감이에요!', msgEn: 'Deadline is today!' },
          { days: 0, time: '21:00', key: 'date-today-21', msgKr: '마감 3시간 전이에요!', msgEn: '3 hours until deadline!' },
          { days: 0, time: '23:00', key: 'date-today-23', msgKr: '마감 1시간 전이에요!', msgEn: '1 hour until deadline!' },
        ]

        dateAlarms.forEach(({ days, time, key, msgKr, msgEn }) => {
          if (diffDays === days && timeStr === time && !isCompletedToday && !isDismissed(todo.id, key)) {
            newAlarms.push({
              title: todo.title,
              message: lang === 'kr' ? msgKr : msgEn,
              todoId: todo.id,
              alarmType: key,
            })
          }
        })
      }

      if (todo.type === 'one-time' && todo.dueDate) {
        const dueDate = new Date(todo.dueDate)
        if (todo.time) {
          const [h, m] = todo.time.split(':').map(Number)
          dueDate.setHours(h, m, 0, 0)
        } else {
          dueDate.setHours(23, 59, 0, 0)
        }
        const diffMins = Math.floor((dueDate - now) / (1000 * 60))
        if (diffMins >= 55 && diffMins <= 65 && !isCompletedToday && !isDismissed(todo.id, 'onetime-1h')) {
          newAlarms.push({
            title: todo.title,
            message: lang === 'kr' ? '1시간 후 마감이에요!' : 'Due in 1 hour!',
            todoId: todo.id,
            alarmType: 'onetime-1h',
          })
        }
      }
    })

    if (newAlarms.length > 0) {
      newAlarms.forEach(alarm => {
        window.electronAPI?.showNotification({
          title: alarm.title,
          body: alarm.message,
        })
        // dismiss 처리
        const key = getAlarmKey(alarm.todoId, alarm.alarmType)
        setDismissedAlarms(prev => {
          const updated = { ...prev, [key]: new Date().toISOString() }
          localStorage.setItem('momo-dismissed-alarms', JSON.stringify(updated))
          return updated
        })
      })
    }
  }

  useEffect(() => {
    const interval = setInterval(checkAlarms, 60000)
    return () => clearInterval(interval)
  }, [todos, lang, dismissedAlarms])

  useEffect(() => {
    window.electronAPI?.onCheckAlarms?.(() => checkAlarms())
  }, [todos, lang])
}

export default function AlarmPopup() { return null }