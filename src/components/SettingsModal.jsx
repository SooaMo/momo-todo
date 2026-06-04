import { useState, useRef, useEffect } from 'react'
import HelpModal from './HelpModal'
import { getT } from '../i18n'

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
  { id: 'mint', label: 'Mint', color: '#7ec8b0' },
  { id: 'peach', label: 'Peach', color: '#e8a87c' },
  { id: 'rose', label: 'Rose', color: '#d4849a' },
  { id: 'ocean', label: 'Ocean', color: '#7ba7bc' },
  { id: 'lavender', label: 'Lavender', color: '#9b8ec4' },
  { id: 'dark', label: 'Dark', color: '#2a3442' },
]

function BannerSetting({ imageKey, label, settings, onSettingsChange, lang }) {
  const t = getT(lang)

  const POSITION_OPTIONS = [
    { id: 'left', label: t.posLeft },
    { id: 'center', label: t.posCenter },
    { id: 'right', label: t.posRight },
  ]
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
              {t.uploadBtn}
            </button>
            {image && (
              <button className="settings-sm-btn danger" onClick={handleRemove}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
                {t.reset}
              </button>
            )}
          </div>

          {/* Position */}
          <div className="settings-position">
            <span className="settings-position-label">{t.position}</span>
            <div className="settings-position-btns">
              {POSITION_OPTIONS.map(p => (
                <button
                  key={p.id}
                  className={`settings-pos-btn ${position === p.id ? 'active' : ''}`}
                  onClick={() => onSettingsChange({ [`${imageKey}-position`]: p.id })}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resize */}
          <div className="settings-position">
            <span className="settings-position-label">{t.resize}</span>
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
            <span className="settings-position-label">{t.background}</span>
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
            <label className="settings-position-label">{t.textOptional}</label>
            <input
              className="form-input"
              type="text"
              placeholder={t.textPlaceholder}
              value={text}
              onChange={e => onSettingsChange({ [`${imageKey}-text`]: e.target.value })}
            />
          </div>

          {/* Text font */}
          <div className="settings-position">
            <span className="settings-position-label">{t.font}</span>
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
            <span className="settings-position-label">{t.textAlign}</span>
            <div className="settings-position-btns">
              {POSITION_OPTIONS.map(p => (
                <button
                  key={p.id}
                  className={`settings-pos-btn ${textPosition === p.id ? 'active' : ''}`}
                  onClick={() => onSettingsChange({ [`${imageKey}-text-position`]: p.id })}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text color */}
          <div className="settings-position">
            <span className="settings-position-label">{t.textColor}</span>
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

function DataSection({ lang }) {
  const t = getT(lang)
  const [exportMsg, setExportMsg] = useState('')
  const [importMsg, setImportMsg] = useState('')
  const importRef = useRef(null)

  const handleExport = () => {
    const data = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      data[key] = localStorage.getItem(key)
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `momotodo-backup-${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setExportMsg(t.exportSuccess)
    setTimeout(() => setExportMsg(''), 3000)
  }

    const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        setImportMsg(t.importSuccess)
        // 메시지 보여주고 바로 저장 후 reload
        requestAnimationFrame(() => {
          localStorage.clear()
          Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(key, value)
          })
          setTimeout(() => window.location.reload(), 500)
        })
      } catch {
        setImportMsg(t.importError)
        setTimeout(() => setImportMsg(''), 3000)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="settings-section">
      <div className="settings-banner-section">
        <div className="settings-banner-header">
          <span className="settings-banner-label">{t.exportData}</span>
        </div>
        <p className="settings-data-desc">{t.exportDesc}</p>
        <button className="update-btn" onClick={handleExport}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {t.exportData}
        </button>
        {exportMsg && <p className="update-status update-ok">{exportMsg}</p>}
      </div>

      <div className="help-divider" />

      <div className="settings-banner-section">
        <div className="settings-banner-header">
          <span className="settings-banner-label">{t.importData}</span>
        </div>
        <p className="settings-data-desc">{t.importDesc}</p>
        <button className="update-btn" onClick={() => importRef.current?.click()}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          {t.importData}
        </button>
        {importMsg && <p className="update-status update-ok">{importMsg}</p>}
        <input ref={importRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
      </div>
    </div>
  )
}

function UpdateSection({ lang }) {
  const t = getT(lang)
  const [status, setStatus] = useState('idle')
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

  const handleGoToRelease = () => {
    window.electronAPI?.openExternal(
      updateInfo?.url || 'https://github.com/SooaMo/momo-todo/releases/latest'
    )
  }

  return (
    <div className="update-section">
      {status === 'idle' && (
        <button className="update-btn" onClick={handleCheck}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          {t.checkUpdates}
        </button>
      )}
      {status === 'checking' && (
        <p className="update-status">{t.checking}</p>
      )}
      {status === 'latest' && (
        <p className="update-status update-ok">{t.upToDate}</p>
      )}
      {status === 'available' && (
        <div className="update-available">
          <p className="update-status update-new">{t.updateAvailable(updateInfo?.version)}</p>
          <button className="update-btn update-btn-accent" onClick={handleGoToRelease}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            {t.downloadGithub}
          </button>
        </div>
      )}
      {status === 'error' && (
        <p className="update-status update-err">{t.updateFailed}</p>
      )}
    </div>
  )
}

function SettingsModal({ onClose, lang, setLang, onPreviewTheme, initialTab }) {
  const [tab, setTab] = useState(initialTab || 'graphic')
  const t = getT(lang)
  const [selectedLang, setSelectedLang] = useState(lang)
  const [showHelp, setShowHelp] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('momo-theme') || 'mint')
  const [appVersion, setAppVersion] = useState('...')
  const [hoveredTheme, setHoveredTheme] = useState(null)

useEffect(() => {
  window.electronAPI?.getAppVersion?.().then(v => setAppVersion(v))
}, [])

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
  setLang(selectedLang)
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
            {[
              { id: 'graphic', label: t.graphic },
              { id: 'data', label: t.data },
              { id: 'help', label: t.help },
              { id: 'about', label: t.about },
            ].map(item => (
              <button key={item.id} className={`settings-tab ${tab === item.id ? 'active' : ''}`} onClick={() => setTab(item.id)}>
                {item.label}
              </button>
            ))}
          </div>

          <div className="modal-body">
           {tab === 'graphic' && (
            <div className="settings-section">
              {/* Language */}
              <div className="settings-banner-section">
                <div className="settings-banner-header">
                  <span className="settings-banner-label">{t.language}</span>
                </div>
                <div className="settings-position-btns" style={{ marginTop: '0.5rem' }}>
                  {[
                    { id: 'en', label: 'English' },
                    { id: 'kr', label: '한국어' },
                  ].map(l => (
                    <button
                      key={l.id}
                      className={`settings-pos-btn ${selectedLang === l.id ? 'active' : ''}`}
                      onClick={() => setSelectedLang(l.id)}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="help-divider" />

              {/* Theme */}
              <div className="settings-banner-section">
                <div className="settings-banner-header">
                  <span className="settings-banner-label">{t.theme}</span>
                </div>
                  <div className="settings-theme-grid">
                    {THEMES.map(theme => (
                      <button
                        key={theme.id}
                        className={`settings-theme-btn ${currentTheme === theme.id ? 'active' : ''}`}
                        onClick={() => setCurrentTheme(theme.id)}
                        onMouseEnter={() => onPreviewTheme(theme.id)}
                        onMouseLeave={() => onPreviewTheme(null)}
                        style={{
                          borderColor: currentTheme === theme.id ? theme.color : 'transparent',
                        }}
                      >
                        <span className="theme-dot" style={{ backgroundColor: theme.color }} />
                        <span>{theme.label}</span>
                        {currentTheme === theme.id && (
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
                                      label={t.bannerToday}
                                      settings={settings}
                                      onSettingsChange={handleSettingsChange}
                                      lang={lang}
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
                  {t.viewHelp}
                </button>

                <button
                  className="settings-help-btn"
                  onClick={() => window.electronAPI?.openExternal('mailto:sooa24@gmail.com?subject=MomoTodo%20Feedback&body=Version%3A%201.0.0%0A%0A')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  {t.reportBug}
                </button>
              </div>
            )}

            {tab === 'data' && <DataSection lang={lang} />}

            {tab === 'about' && (
              <div className="settings-section about-section">
                <div className="about-logo">MomoTodo</div>
                <div className="about-version">v{appVersion}</div>
                <div className="about-divider" />
                <div className="about-row">
                  <span className="about-label">{t.madeBy} </span>
                  <span className="about-value">Momo</span>
                </div>
                <div className="about-row">
                  <span className="about-label">{t.builtWith}</span>
                  <span className="about-value">Electron + React</span>
                </div>
                <div className="about-row">
                  <span className="about-label">{t.storage}</span>
                  <span className="about-value">{t.localOnly}</span>
                </div>
                <p className="about-desc">
                 {t.aboutDesc}
                </p>
                <div className="about-divider" />
                <UpdateSection lang={lang} />
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

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} lang={lang} />}
    </>
  )
}

export default SettingsModal