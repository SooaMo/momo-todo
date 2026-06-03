import { useState, useRef } from 'react'
import HelpModal from './HelpModal'

const POSITION_OPTIONS = ['left', 'center', 'right']

function BannerSetting({ imageKey, label, settings, onSettingsChange }) {
  const inputRef = useRef(null)

  const visible = settings[`${imageKey}-visible`] !== false
  const position = settings[`${imageKey}-position`] || 'center'
  const image = settings[imageKey] || null

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      onSettingsChange({ [`${imageKey}`]: ev.target.result })
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    onSettingsChange({ [imageKey]: null })
  }

  const handleToggleVisible = () => {
    onSettingsChange({ [`${imageKey}-visible`]: !visible })
  }

  const handlePosition = (pos) => {
    onSettingsChange({ [`${imageKey}-position`]: pos })
  }

  return (
    <div className="settings-banner-section">
      <div className="settings-banner-header">
        <span className="settings-banner-label">{label}</span>
        <button
          className={`settings-toggle ${visible ? 'on' : 'off'}`}
          onClick={handleToggleVisible}
        >
          {visible ? 'ON' : 'OFF'}
        </button>
      </div>

      {visible && (
        <div className="settings-banner-controls">
          <div
            className="settings-banner-preview"
            style={{
              backgroundImage: image ? `url(${image})` : undefined,
              backgroundColor: image ? undefined : 'var(--color-secondary)',
              backgroundSize: 'auto 100%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: position,
            }}
          >
            {!image && <span className="settings-banner-empty">No custom image</span>}
          </div>

          <div className="settings-banner-btns">
            <button className="settings-sm-btn" onClick={() => inputRef.current?.click()}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload
            </button>
            {image && (
              <button className="settings-sm-btn danger" onClick={handleRemove}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
                Reset
              </button>
            )}
          </div>

          <div className="settings-position">
            <span className="settings-position-label">Position</span>
            <div className="settings-position-btns">
              {POSITION_OPTIONS.map(p => (
                <button
                  key={p}
                  className={`settings-pos-btn ${position === p ? 'active' : ''}`}
                  onClick={() => handlePosition(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
    </div>
  )
}

function SettingsModal({ onClose }) {
  const [tab, setTab] = useState('banners')
  const [showHelp, setShowHelp] = useState(false)

  // Load current settings into local state
  const [settings, setSettings] = useState(() => ({
  'momo-banner-top': localStorage.getItem('momo-banner-top') || null,
  'momo-banner-top-visible': localStorage.getItem('momo-banner-top-visible') !== 'false',
  'momo-banner-top-position': localStorage.getItem('momo-banner-top-position') || 'center',
  'momo-banner-bottom': localStorage.getItem('momo-banner-bottom') || null,
  'momo-banner-bottom-visible': localStorage.getItem('momo-banner-bottom-visible') !== 'false',
  'momo-banner-bottom-position': localStorage.getItem('momo-banner-bottom-position') || 'center',
  'momo-banner-calendar-month-bottom': localStorage.getItem('momo-banner-calendar-month-bottom') || null,
  'momo-banner-calendar-month-bottom-visible': localStorage.getItem('momo-banner-calendar-month-bottom-visible') !== 'false',
  'momo-banner-calendar-month-bottom-position': localStorage.getItem('momo-banner-calendar-month-bottom-position') || 'center',
  'momo-banner-calendar-week-bottom': localStorage.getItem('momo-banner-calendar-week-bottom') || null,
  'momo-banner-calendar-week-bottom-visible': localStorage.getItem('momo-banner-calendar-week-bottom-visible') !== 'false',
  'momo-banner-calendar-week-bottom-position': localStorage.getItem('momo-banner-calendar-week-bottom-position') || 'center',
}))

  const handleSettingsChange = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }

  const handleSave = () => {
    Object.entries(settings).forEach(([key, value]) => {
      if (value === null) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, value)
      }
    })
    onClose()
    window.location.reload()
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal settings-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Settings</h2>
            <button className="modal-close" onClick={onClose}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div className="settings-tabs">
            {['banners', 'help', 'about'].map(t => (
              <button
                key={t}
                className={`settings-tab ${tab === t ? 'active' : ''}`}
                onClick={() => setTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="modal-body">
            {tab === 'banners' && (
  <div className="settings-section">
    <BannerSetting
      imageKey="momo-banner-top"
      label="Top Banner (Today)"
      settings={settings}
      onSettingsChange={handleSettingsChange}
    />
    <div className="help-divider" />
    <BannerSetting
      imageKey="momo-banner-bottom"
      label="Bottom Banner (Today)"
      settings={settings}
      onSettingsChange={handleSettingsChange}
    />
    <div className="help-divider" />
    <BannerSetting
      imageKey="momo-banner-calendar-month-bottom"
      label="Bottom Banner (Calendar - Month)"
      settings={settings}
      onSettingsChange={handleSettingsChange}
    />
    <div className="help-divider" />
    <BannerSetting
      imageKey="momo-banner-calendar-week-bottom"
      label="Bottom Banner (Calendar - Week)"
      settings={settings}
      onSettingsChange={handleSettingsChange}
    />
  </div>
)}

            {tab === 'help' && (
              <div className="settings-section">
                <button className="settings-help-btn" onClick={() => setShowHelp(true)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  View How to use MomoTodo
                </button>
              </div>
            )}

            {tab === 'about' && (
              <div className="settings-section about-section">
                <div className="about-logo">MomoTodo</div>
                <div className="about-version">v1.0.0</div>
                <div className="about-divider" />
                <div className="about-row">
                  <span className="about-label">Made by</span>
                  <span className="about-value">Momo</span>
                </div>
                <div className="about-row">
                  <span className="about-label">Built with</span>
                  <span className="about-value">Electron + React</span>
                </div>
                <div className="about-row">
                  <span className="about-label">Storage</span>
                  <span className="about-value">Local only</span>
                </div>
                <p className="about-desc">
                  A personal todo app that keeps your tasks organized — daily, weekly, or one-time. Your data never leaves your computer.
                </p>
              </div>
            )}
          </div>

          {tab === 'banners' && (
            <div className="modal-footer">
              <button className="btn-cancel" onClick={onClose}>Cancel</button>
              <button className="btn-submit" onClick={handleSave}>Save</button>
            </div>
          )}
        </div>
      </div>

      {showHelp && (
        <HelpModal onClose={() => setShowHelp(false)} />
      )}
    </>
  )
}

export default SettingsModal