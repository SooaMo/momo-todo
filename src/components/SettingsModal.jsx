import { useState, useRef, useEffect } from 'react'
import HelpModal from './HelpModal'

const POSITION_OPTIONS = ['left', 'center', 'right']
const RESIZE_OPTIONS = ['fill', 'fit', 'tile']
const FONT_OPTIONS = [
  { id: 'Pretendard', label: 'Pretendard' },
  { id: 'Playfair Display', label: 'Playfair' },
  { id: 'Caveat', label: 'Caveat' },
]
const TEXT_COLORS = [
  { label: 'White', value: '#ffffff' },
  { label: 'Black', value: '#000000' },
  { label: 'Primary', value: 'var(--color-primary)' },
  { label: 'Accent', value: 'var(--color-accent)' },
]
const BG_COLORS = [
  { label: 'None', value: 'none' },
  { label: 'White', value: '#ffffff' },
  { label: 'Black', value: '#000000' },
  { label: 'Primary', value: 'var(--color-primary)' },
  { label: 'Secondary', value: 'var(--color-secondary)' },
  { label: 'Accent', value: 'var(--color-accent)' },
]
const THEMES = [
  { id: 'mint', label: 'Mint', color: '#94bba9' },
  { id: 'ocean', label: 'Ocean', color: '#7ba7bc' },
  { id: 'lavender', label: 'Lavender', color: '#9b8ec4' },
  { id: 'dark', label: 'Dark', color: '#2a3442' },
]

function BannerSetting({ imageKey, label, settings, onSettingsChange }) {
  const inputRef = useRef(null)
  const colorInputRef = useRef(null)

  const visible = settings[`${imageKey}-visible`] !== false
  const position = settings[`${imageKey}-position`] || 'right'
  const resize = settings[`${imageKey}-resize`] || 'fit'
  const image = settings[imageKey] || null
  const text = settings[`${imageKey}-text`] !== undefined
    ? settings[`${imageKey}-text`]
    : "let's get things done ✦"
  const textPosition = settings[`${imageKey}-text-position`] || 'left'
  const textColor = settings[`${imageKey}-text-color`] || '#000000'
  const textFont = settings[`${imageKey}-text-font`] || 'Pretendard'
  const bgColor = settings[`${imageKey}-bg-color`] || '#ffffff'
  const bgColorCustom = settings[`${imageKey}-bg-color-custom`] || '#ffffff'

  const resolvedBgColor = bgColor === 'custom'
    ? bgColorCustom
    : bgColor === 'none' ? undefined : bgColor

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onSettingsChange({ [imageKey]: ev.target.result })
    reader.readAsDataURL(file)
  }

  const handleRemove = () => onSettingsChange({ [imageKey]: null })
  const handleToggleVisible = () => onSettingsChange({ [`${imageKey}-visible`]: !visible })

  return (
    <div className="settings-banner-section">
      <div className="settings-banner-header">
        <span className="settings-banner-label">{label}</span>
        <button className={`settings-toggle ${visible ? 'on' : 'off'}`} onClick={handleToggleVisible}>
          {visible ? 'ON' : 'OFF'}
        </button>
      </div>

      {visible && (
        <div className="settings-banner-controls">
          {/* Preview */}
          <div className="settings-banner-preview" style={{
            backgroundImage: image ? `url(${image})` : undefined,
            backgroundColor: resolvedBgColor || (image ? undefined : 'var(--color-secondary)'),
            backgroundSize: resize === 'fit' ? 'contain' : resize === 'tile' ? 'auto' : 'cover',
            backgroundRepeat: resize === 'tile' ? 'repeat' : 'no-repeat',
            backgroundPosition: position,
          }}>
            {!image && !resolvedBgColor && <span className="settings-banner-empty">No custom image</span>}
          </div>

          {/* Upload / Reset */}
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

          {/* Position */}
          <div className="settings-position">
            <span className="settings-position-label">Position</span>
            <div className="settings-position-btns">
              {POSITION_OPTIONS.map(p => (
                <button
                  key={p}
                  className={`settings-pos-btn ${position === p ? 'active' : ''}`}
                  onClick={() => onSettingsChange({ [`${imageKey}-position`]: p })}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Resize */}
          <div className="settings-position">
            <span className="settings-position-label">Resize</span>
            <div className="settings-position-btns">
              {RESIZE_OPTIONS.map(r => (
                <button
                  key={r}
                  className={`settings-pos-btn ${resize === r ? 'active' : ''}`}
                  onClick={() => onSettingsChange({ [`${imageKey}-resize`]: r })}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Background color */}
          <div className="settings-position">
            <span className="settings-position-label">Background</span>
            <div className="settings-text-colors">
              {BG_COLORS.map(c => (
                <button
                  key={c.value}
                  className={`settings-color-btn ${bgColor === c.value ? 'active' : ''}`}
                  style={{
                    backgroundColor:
                      c.value === 'none' ? 'transparent'
                      : c.value === 'var(--color-primary)' ? 'var(--color-primary)'
                      : c.value === 'var(--color-secondary)' ? 'var(--color-secondary)'
                      : c.value === 'var(--color-accent)' ? 'var(--color-accent)'
                      : c.value,
                    border: ['none', '#ffffff'].includes(c.value) ? '1px solid var(--color-secondary)' : 'none',
                  }}
                  onClick={() => onSettingsChange({ [`${imageKey}-bg-color`]: c.value })}
                  title={c.label}
                >
                  {c.value === 'none' && <span style={{ fontSize: '0.6rem', color: 'var(--color-text-light)' }}>∅</span>}
                </button>
              ))}
              <label
                className={`settings-color-btn custom-color-btn ${bgColor === 'custom' ? 'active' : ''}`}
                title="Custom"
                style={{ background: bgColor === 'custom' ? bgColorCustom : 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)' }}
              >
                <input
                  ref={colorInputRef}
                  type="color"
                  value={bgColorCustom}
                  onChange={e => onSettingsChange({
                    [`${imageKey}-bg-color`]: 'custom',
                    [`${imageKey}-bg-color-custom`]: e.target.value,
                  })}
                  style={{ opacity: 0, position: 'absolute', width: 0, height: 0 }}
                />
              </label>
            </div>
          </div>

          <div className="help-divider" />

          {/* Text */}
          <div className="form-group">
            <label className="settings-position-label">Text (optional)</label>
            <input
              className="form-input"
              type="text"
              placeholder="let's get things done ✦"
              value={text}
              onChange={e => onSettingsChange({ [`${imageKey}-text`]: e.target.value })}
            />
          </div>

          {/* Text font */}
          <div className="settings-position">
            <span className="settings-position-label">Font</span>
            <div className="settings-position-btns">
              {FONT_OPTIONS.map(f => (
                <button
                  key={f.id}
                  className={`settings-pos-btn ${textFont === f.id ? 'active' : ''}`}
                  style={{ fontFamily: f.id }}
                  onClick={() => onSettingsChange({ [`${imageKey}-text-font`]: f.id })}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text align */}
          <div className="settings-position">
            <span className="settings-position-label">Text align</span>
            <div className="settings-position-btns">
              {POSITION_OPTIONS.map(p => (
                <button
                  key={p}
                  className={`settings-pos-btn ${textPosition === p ? 'active' : ''}`}
                  onClick={() => onSettingsChange({ [`${imageKey}-text-position`]: p })}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Text color */}
          <div className="settings-position">
            <span className="settings-position-label">Text color</span>
            <div className="settings-text-colors">
              {TEXT_COLORS.map(c => (
                <button
                  key={c.value}
                  className={`settings-color-btn ${textColor === c.value ? 'active' : ''}`}
                  style={{
                    backgroundColor:
                      c.value === 'var(--color-primary)' ? 'var(--color-primary)'
                      : c.value === 'var(--color-accent)' ? 'var(--color-accent)'
                      : c.value,
                    border: c.value === '#ffffff' ? '1px solid var(--color-secondary)' : 'none',
                  }}
                  onClick={() => onSettingsChange({ [`${imageKey}-text-color`]: c.value })}
                  title={c.label}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
    </div>
  )
}

function UpdateSection() {
  const [status, setStatus] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [updateInfo, setUpdateInfo] = useState(null)

  useEffect(() => {
    window.electronAPI?.onUpdateAvailable((_, info) => {
      setStatus('available')
      setUpdateInfo(info)
    })
    window.electronAPI?.onUpdateNotAvailable(() => {
      setStatus('latest')
      setTimeout(() => setStatus('idle'), 3000)
    })
    window.electronAPI?.onUpdateDownloadProgress((_, p) => {
      setStatus('downloading')
      setProgress(Math.round(p.percent))
    })
    window.electronAPI?.onUpdateDownloaded((_, info) => {
      setStatus('downloaded')
      setUpdateInfo(info)
    })
    window.electronAPI?.onUpdateError(() => {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    })

    window.electronAPI?.getUpdateAvailable?.().then(avail => {
      if (avail) setStatus('available')
    })
  }, [])

  const handleCheck = () => {
    setStatus('checking')
    window.electronAPI?.checkForUpdates()
  }

  const handleDownload = () => {
    setStatus('downloading')
    window.electronAPI?.downloadUpdate()
  }

  const handleInstall = () => {
    window.electronAPI?.installUpdate()
  }

  return (
    <div className="update-section">
      {status === 'idle' && (
        <button className="update-btn" onClick={handleCheck}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          Check for Updates
        </button>
      )}
      {status === 'checking' && (
        <p className="update-status">Checking for updates...</p>
      )}
      {status === 'latest' && (
        <p className="update-status update-ok">✓ You're up to date!</p>
      )}
      {status === 'available' && (
        <div className="update-available">
          <p className="update-status update-new">🎉 v{updateInfo?.version} is available!</p>
          <button className="update-btn update-btn-accent" onClick={handleDownload}>
            Download Update
          </button>
        </div>
      )}
      {status === 'downloading' && (
        <div className="update-downloading">
          <p className="update-status">Downloading... {progress}%</p>
          <div className="update-progress-bar">
            <div className="update-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
      {status === 'downloaded' && (
        <div className="update-available">
          <p className="update-status update-ok">✓ Ready to install v{updateInfo?.version}</p>
          <button className="update-btn update-btn-accent" onClick={handleInstall}>
            Restart & Install
          </button>
        </div>
      )}
      {status === 'error' && (
        <p className="update-status update-err">Failed to check for updates</p>
      )}
    </div>
  )
}

function SettingsModal({ onClose }) {
  const [tab, setTab] = useState('graphic')
  const [showHelp, setShowHelp] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('momo-theme') || 'mint')
  const appVersion = '1.0.0'

  const [settings, setSettings] = useState(() => ({
    'momo-banner-top': localStorage.getItem('momo-banner-top') || null,
    'momo-banner-top-visible': localStorage.getItem('momo-banner-top-visible') !== 'false',
    'momo-banner-top-position': localStorage.getItem('momo-banner-top-position') || 'right',
    'momo-banner-top-resize': localStorage.getItem('momo-banner-top-resize') || 'fit',
    'momo-banner-top-text': localStorage.getItem('momo-banner-top-text') ?? "let's get things done ✦",
    'momo-banner-top-text-position': localStorage.getItem('momo-banner-top-text-position') || 'left',
    'momo-banner-top-text-color': localStorage.getItem('momo-banner-top-text-color') || '#000000',
    'momo-banner-top-text-font': localStorage.getItem('momo-banner-top-text-font') || 'Pretendard',
    'momo-banner-top-bg-color': localStorage.getItem('momo-banner-top-bg-color') || '#ffffff',
    'momo-banner-top-bg-color-custom': localStorage.getItem('momo-banner-top-bg-color-custom') || '#ffffff',
  }))

  const handleSettingsChange = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }

  const handleSave = () => {
    Object.entries(settings).forEach(([key, value]) => {
      if (value === null) localStorage.removeItem(key)
      else localStorage.setItem(key, String(value))
    })
    localStorage.setItem('momo-theme', currentTheme)
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
            {['graphic', 'help', 'about'].map(t => (
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
            {tab === 'graphic' && (
              <div className="settings-section">
                <div className="settings-banner-section">
                  <div className="settings-banner-header">
                    <span className="settings-banner-label">Theme</span>
                  </div>
                  <div className="settings-theme-grid">
                    {THEMES.map(t => (
                      <button
                        key={t.id}
                        className={`settings-theme-btn ${currentTheme === t.id ? 'active' : ''}`}
                        onClick={() => setCurrentTheme(t.id)}
                      >
                        <span className="theme-dot" style={{ backgroundColor: t.color }} />
                        <span>{t.label}</span>
                        {currentTheme === t.id && (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="help-divider" />

                <BannerSetting
                  imageKey="momo-banner-top"
                  label="Banner (Today)"
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
                <div className="about-version">v{appVersion}</div>
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
                <div className="about-divider" />
                <UpdateSection />
              </div>
            )}
          </div>

          {tab === 'graphic' && (
            <div className="modal-footer">
              <button className="btn-cancel" onClick={onClose}>Cancel</button>
              <button className="btn-submit" onClick={handleSave}>Save</button>
            </div>
          )}
        </div>
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  )
}

export default SettingsModal