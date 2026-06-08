import { getT } from '../i18n'

function HelpModal({ onClose, lang }) {
  const t = getT(lang)
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal help-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t.howToUse}</h2>
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
                <p className="help-section-title">{t.helpTodoTypes}</p>
                <p className="help-section-desc">{t.helpTodoTypesDesc}</p>
              </div>
            </div>
            <div className="help-chips">
              <div className="help-chip">
                <span className="help-chip-label">{t.tabDaily}</span>
                <span className="help-chip-desc">{t.helpTodoTypesDaily}</span>
              </div>
              <div className="help-chip">
                <span className="help-chip-label">{t.tabWeekly}</span>
                <span className="help-chip-desc">{t.helpTodoTypesWeekly}</span>
              </div>
              <div className="help-chip">
                <span className="help-chip-label">{t.tabDate}</span>
                <span className="help-chip-desc">{t.helpTodoTypesDate}</span>
              </div>
              <div className="help-chip">
                <span className="help-chip-label">{t.tabOneTime}</span>
                <span className="help-chip-desc">{t.helpTodoTypesOneTime}</span>
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
                <p className="help-section-title">{t.helpCheckTitle}</p>
                <p className="help-section-desc">{t.helpCheckDesc}</p>
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
                <p className="help-section-title">{t.helpPriorityTitle}</p>
                <p className="help-section-desc">{t.helpPriorityDesc}</p>
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
                <p className="help-section-title">{t.helpMemoTitle}</p>
                <p className="help-section-desc">{t.helpMemoDesc}</p>
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
                <p className="help-section-title">{t.helpCalendarTitle}</p>
                <p className="help-section-desc">{t.helpCalendarDesc}</p>
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
                <p className="help-section-title">{t.helpArchiveTitle}</p>
                <p className="help-section-desc">{t.helpArchiveDesc}</p>
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
                <p className="help-section-title">{t.helpStickerTitle}</p>
                <p className="help-section-desc">{t.helpStickerDesc}</p>
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
                <p className="help-section-title">{t.helpSettingsTitle}</p>
                <p className="help-section-desc">{t.helpSettingsDesc}</p>
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
                <p className="help-section-title">{t.helpPinTitle}</p>
                <p className="help-section-desc">{t.helpPinDesc}</p>
              </div>
            </div>
          </div>

          <div className="help-divider" />

          {/* Folders */}
          <div className="help-section">
            <div className="help-icon-row">
              <span className="help-icon" style={{ background: 'var(--color-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </span>
              <div>
                <p className="help-section-title">{t.helpFolderTitle}</p>
                <p className="help-section-desc">{t.helpFolderDesc}</p>
              </div>
            </div>
          </div>

          <div className="help-divider" />

          {/* Alarms */}
          <div className="help-section">
            <div className="help-icon-row">
              <span className="help-icon" style={{ background: 'var(--color-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </span>
              <div>
                <p className="help-section-title">{t.helpAlarmTitle}</p>
                <p className="help-section-desc">{t.helpAlarmDesc}</p>
              </div>
            </div>
          </div>

          <div className="help-divider" />

{/* Urgency */}
<div className="help-section">
  <div className="help-icon-row">
    <span className="help-icon" style={{ background: 'var(--color-secondary)' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </span>
    <div>
      <p className="help-section-title">{t.helpUrgencyTitle}</p>
      <p className="help-section-desc">{t.helpUrgencyDesc}</p>
    </div>
  </div>
</div>

          <div className="help-divider" />

          {/* Calendar Filter */}
          <div className="help-section">
            <div className="help-icon-row">
              <span className="help-icon" style={{ background: 'var(--color-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
              </span>
              <div>
                <p className="help-section-title">{t.helpCalendarFilterTitle}</p>
                <p className="help-section-desc">{t.helpCalendarFilterDesc}</p>
              </div>
            </div>
          </div>

        </div>
        <div className="modal-footer" style={{ justifyContent: 'center' }}>
          <button className="btn-submit" onClick={onClose}>{t.gotIt}</button>
        </div>
      </div>
    </div>
  )
}

export default HelpModal