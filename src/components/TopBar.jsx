function TopBar({ alwaysOnTop, onToggleAlwaysOnTop, onOpenArchive, mainView, setMainView }) {
  const handleAlwaysOnTop = () => {
    window.electronAPI?.toggleAlwaysOnTop()
    onToggleAlwaysOnTop()
  }

  const handleMinimize = () => {
    window.electronAPI?.minimizeWindow()
  }

  const handleClose = () => {
    window.electronAPI?.closeWindow()
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-title">momo todo</span>
        <div className="view-tabs">
          <button
            className={`view-tab ${mainView === 'todo' ? 'active' : ''}`}
            onClick={() => setMainView('todo')}
          >
            Todo
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
        <button className="topbar-btn" onClick={onOpenArchive} title="Archive">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="21 8 21 21 3 21 3 8"/>
            <rect x="1" y="3" width="22" height="5"/>
            <line x1="10" y1="12" x2="14" y2="12"/>
          </svg>
        </button>
        <button className="topbar-btn" onClick={handleMinimize} title="Minimize">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
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