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
                <span className="help-chip-desc">Active during a start~end date range</span>
              </div>
              <div className="help-chip">
                <span className="help-chip-label">One-time</span>
                <span className="help-chip-desc">One-off task, optional due date</span>
              </div>
            </div>
          </div>

          <div className="help-divider" />

          <div className="help-section">
            <div className="help-icon-row">
              <span className="help-icon" style={{ background: 'var(--color-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              <div>
                <p className="help-section-title">Check & Complete</p>
                <p className="help-section-desc">Click a todo or its checkbox to mark it done for today. Daily & Weekly todos reset automatically the next day</p>
              </div>
            </div>
          </div>

          <div className="help-divider" />

          <div className="help-section">
            <div className="help-icon-row">
              <span className="help-icon" style={{ background: 'var(--color-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </span>
              <div>
                <p className="help-section-title">Calendar</p>
                <p className="help-section-desc">Click a date in Month view to jump to Week view. Select a day to see and check off its todos</p>
              </div>
            </div>
          </div>

          <div className="help-divider" />

          <div className="help-section">
            <div className="help-icon-row">
              <span className="help-icon" style={{ background: 'var(--color-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
                </svg>
              </span>
              <div>
                <p className="help-section-title">Archive (X button)</p>
                <p className="help-section-desc">The X button moves a todo to the Archive, not delete. You can restore or permanently delete it from there</p>
              </div>
            </div>
          </div>

          <div className="help-divider" />

          <div className="help-section">
            <div className="help-icon-row">
              <span className="help-icon" style={{ background: 'var(--color-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="5" r="1" fill="currentColor"/><circle cx="15" cy="5" r="1" fill="currentColor"/>
                  <circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/>
                  <circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/>
                </svg>
              </span>
              <div>
                <p className="help-section-title">Reorder</p>
                <p className="help-section-desc">Drag the dots icon on the left to reorder your todos</p>
              </div>
            </div>
          </div>

          <div className="help-divider" />

          <div className="help-divider" />

<div className="help-section">
  <div className="help-icon-row">
    <span className="help-icon" style={{ background: 'var(--color-secondary)' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    </span>
    <div>
      <p className="help-section-title">Banners</p>
      <p className="help-section-desc">Add images to the top and bottom of the Today and Calendar views. Go to Settings → Banners to upload, reposition, or hide banners anytime</p>
    </div>
  </div>
</div>

          <div className="help-section">
            <div className="help-icon-row">
              <span className="help-icon" style={{ background: 'var(--color-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="17" x2="12" y2="22"/>
                  <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>
                </svg>
              </span>
              <div>
                <p className="help-section-title">Pin & Theme</p>
                <p className="help-section-desc">Pin button keeps the app always on top. Droplet button lets you switch color themes</p>
              </div>
            </div>
          </div>

        </div>
        <div className="modal-footer" style={{ justifyContent: 'center' }}>
          <button className="btn-submit" onClick={onClose}>Get Started!</button>
        </div>
      </div>
    </div>
  )
}

export default HelpModal