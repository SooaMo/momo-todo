import { useState, useRef, useEffect } from 'react'

const THEME_OPTIONS = [
  { id: 'mint', label: 'Mint', color: '#94bba9' },
  { id: 'ocean', label: 'Ocean', color: '#7ba7bc' },
  { id: 'lavender', label: 'Lavender', color: '#9b8ec4' },
  { id: 'dark', label: 'Dark', color: '#4a9e8a' },
]

function TopBar({ alwaysOnTop, onToggleAlwaysOnTop, onOpenArchive, mainView, setMainView, theme, setTheme, onOpenHelp, onOpenSettings  }) {
  const [showThemeDropdown, setShowThemeDropdown] = useState(false)
  const themeRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (themeRef.current && !themeRef.current.contains(e.target)) {
        setShowThemeDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAlwaysOnTop = () => {
    window.electronAPI?.toggleAlwaysOnTop()
    onToggleAlwaysOnTop()
  }

  const handleMinimize = () => window.electronAPI?.minimizeWindow()
  const handleClose = () => window.electronAPI?.closeWindow()

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-title">MomoTodo</span>
        <div className="view-tabs">
          <button
            className={`view-tab ${mainView === 'todo' ? 'active' : ''}`}
            onClick={() => setMainView('todo')}
          >
            Today
          </button>
          <button
            className={`view-tab ${mainView === 'calendar' ? 'active' : ''}`}
            onClick={() => setMainView('calendar')}
          >
            Calendar
          </button>
        </div>
      </div>

      <div className="topbar-controls">
        {/* Setting */}
       <button className="topbar-btn" onClick={onOpenSettings} title="Settings">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
</button>

        {/* Theme picker */}
        <div className="theme-dropdown-wrap" ref={themeRef}>
          <button
            className="topbar-btn theme-btn"
            onClick={() => setShowThemeDropdown(prev => !prev)}
            title="Theme"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
          </button>
          {showThemeDropdown && (
            <div className="theme-dropdown">
              {THEME_OPTIONS.map(t => (
                <button
                  key={t.id}
                  className={`theme-dropdown-item ${theme === t.id ? 'active' : ''}`}
                  onClick={() => { setTheme(t.id); setShowThemeDropdown(false) }}
                >
                  <span className="theme-dot" style={{ backgroundColor: t.color }} />
                  <span>{t.label}</span>
                  {theme === t.id && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pin */}
        <button
          className={`topbar-btn pin-btn ${alwaysOnTop ? 'pin-active' : ''}`}
          onClick={handleAlwaysOnTop}
          title="Always on Top"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="17" x2="12" y2="22"/>
            <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>
          </svg>
        </button>

        {/* Archive */}
        <button className="topbar-btn" onClick={onOpenArchive} title="Archive">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="21 8 21 21 3 21 3 8"/>
            <rect x="1" y="3" width="22" height="5"/>
            <line x1="10" y1="12" x2="14" y2="12"/>
          </svg>
        </button>

        {/* Minimize */}
        <button className="topbar-btn" onClick={handleMinimize} title="Minimize">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>

        {/* Close */}
        <button className="topbar-btn close-btn" onClick={handleClose} title="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </header>
  )
}

export default TopBar