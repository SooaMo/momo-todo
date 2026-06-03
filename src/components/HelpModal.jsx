function HelpModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal help-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">How to use MomoTodo</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="modal-body help-body">

          {/* Todo Types */}
          <div className="help-section">
            <div className="help-icon-row">
              <span className="help-icon" style={{ background: 'var(--color-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </span>
              <div>
                <p className="help-section-title">Todo Types</p>
                <p className="help-section-desc">Set how often a todo repeats</p>
              </div>
            </div>
            <div className="help-chips">
              <div className="help-chip">
                <span className="help-chip-label">Daily</span>
                <span className="help-chip-desc">Repeats every day</span>
              </div>
              <div className="help-chip">
                <span className="help-chip-label">Weekly</span>
                <span className="help-chip-desc">Repeats on specific days of the week</span>
              </div>
              <div className="help-chip">
                <span className="help-chip-label">Date</span>
                <span className="help-chip-desc">Active during a start ~ end date range</span>
              </div>
              <div className="help-chip">
                <span className="help-chip-label">One-time</span>
                <span className="help-chip-desc">One-off task, optional due date. Shows until completed</span>
              </div>
            </div>
          </div>

          <div className="help-divider" />

          {/* Check & Complete */}
          <div className="help-section">
            <div className="help-icon-row">
              <span className="help-icon" style={{ background: 'var(--color-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              <div>
                <p className="help-section-title">Check & Complete</p>
                <p className="help-section-desc">Click the checkbox to mark done for today. Daily & Weekly todos reset automatically the next day. Completed todos move to the bottom automatically</p>
              </div>
            </div>
          </div>

          <div className="help-divider" />

          {/* Priority & Filter */}
          <div className="help-section">
            <div className="help-icon-row">
              <span className="help-icon" style={{ background: 'var(--color-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6"/>
                  <line x1="4" y1="12" x2="14" y2="12"/>
                  <line x1="4" y1="18" x2="10" y2="18"/>
                </svg>
              </span>
              <div>
                <p className="help-section-title">Priority & Filter</p>
                <p className="help-section-desc">Todos are sorted by High → Mid → Low priority. Use the type tabs (daily, weekly...) and Priority dropdown to filter your list. Drag the ⠿ handle on the left to reorder manually</p>
              </div>
            </div>
          </div>

          <div className="help-divider" />

          {/* Memo */}
          <div className="help-section">
            <div className="help-icon-row">
              <span className="help-icon" style={{ background: 'var(--color-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </span>
              <div>
                <p className="help-section-title">Memo</p>
                <p className="help-section-desc">Add a note to any todo when creating or editing. Click the todo title to expand and see the memo</p>
              </div>
            </div>
          </div>

          <div className="help-divider" />

          {/* Calendar */}
          <div className="help-section">
            <div className="help-icon-row">
              <span className="help-icon" style={{ background: 'var(--color-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </span>
              <div>
                <p className="help-section-title">Calendar</p>
                <p className="help-section-desc">Switch between Month and Week views. Click a date in Month view to jump to that week. Select a day in Week view to see and check off todos for that day — past completions are preserved</p>
              </div>
            </div>
          </div>

          <div className="help-divider" />

          {/* Archive */}
          <div className="help-section">
            <div className="help-icon-row">
              <span className="help-icon" style={{ background: 'var(--color-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
                </svg>
              </span>
              <div>
                <p className="help-section-title">Archive</p>
                <p className="help-section-desc">The X button moves a todo to the Archive — not delete. Open the archive (📦 icon) to restore or permanently delete items</p>
              </div>
            </div>
          </div>

          <div className="help-divider" />

          {/* Stickers */}
          <div className="help-section">
            <div className="help-icon-row">
              <span className="help-icon" style={{ background: 'var(--color-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <path d="M16 3v5h5"/>
                  <path d="M12 10c-1.5-1.5-4 0-4 2s2 3 4 5c2-2 4-3 4-5s-2.5-3.5-4-2z"/>
                </svg>
              </span>
              <div>
                <p className="help-section-title">Stickers</p>
                <p className="help-section-desc">Click the sticker icon in the top bar to open the sticker panel. Upload images, then drag them onto the app. Click a placed sticker to select it — drag to move, use the corner handle to resize, or press X to remove. Each page (Today, Calendar Month, Week) has its own stickers</p>
              </div>
            </div>
          </div>

          <div className="help-divider" />

          {/* Settings */}
          <div className="help-section">
            <div className="help-icon-row">
              <span className="help-icon" style={{ background: 'var(--color-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </span>
              <div>
                <p className="help-section-title">Settings</p>
                <p className="help-section-desc">Change the color theme, customize the top banner (image, background color, text), under the ⚙️ settings icon</p>
              </div>
            </div>
          </div>

          <div className="help-divider" />

          {/* Pin */}
          <div className="help-section">
            <div className="help-icon-row">
              <span className="help-icon" style={{ background: 'var(--color-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="17" x2="12" y2="22"/>
                  <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>
                </svg>
              </span>
              <div>
                <p className="help-section-title">Always on Top</p>
                <p className="help-section-desc">Click the pin icon to keep MomoTodo on top of all other windows. Click again to disable</p>
              </div>
            </div>
          </div>

        </div>
        <div className="modal-footer" style={{ justifyContent: 'center' }}>
          <button className="btn-submit" onClick={onClose}>Got it!</button>
        </div>
      </div>
    </div>
  )
}

export default HelpModal