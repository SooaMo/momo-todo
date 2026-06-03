import { useRef, useState } from 'react'
import catImg from '../assets/cat.png'

const POSITION_OPTIONS = [
  { id: 'center', label: 'Center' },
  { id: 'top', label: 'Top' },
  { id: 'bottom', label: 'Bottom' },
  { id: 'left', label: 'Left' },
  { id: 'right', label: 'Right' },
]

function BannerImage({ imageKey, className }) {
  const inputRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const visible = localStorage.getItem(`${imageKey}-visible`) !== 'false'

if (!visible) return null

  const saved = localStorage.getItem(imageKey)
  const savedPosition = localStorage.getItem(`${imageKey}-position`) || 'center'
  const [position, setPosition] = useState(savedPosition)

  const isDefault = !saved

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      localStorage.setItem(imageKey, ev.target.result)
      window.location.reload()
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    localStorage.removeItem(imageKey)
    window.location.reload()
  }

  const handlePositionChange = (pos) => {
    setPosition(pos)
    localStorage.setItem(`${imageKey}-position`, pos)
  }

  const bgStyle = isDefault
  ? {
      backgroundColor: '#1a1a2e',
      backgroundImage: `url(${catImg})`,
      backgroundSize: 'auto 100%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right center',
    }
  : {
      backgroundImage: `url(${saved})`,
      backgroundSize: 'auto 100%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: position,
    }

  return (
    <div
      className={`banner-image ${className || ''}`}
      style={bgStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowSettings(false) }}
    >
      {/* Default banner left text */}
      {isDefault && (
        <div className="banner-default-text">
          <span>hello there</span>
          <span className="banner-sub">click ✏️ to customize</span>
        </div>
      )}

      {hovered && (
        <div className="banner-actions">
          <button
            className="banner-btn"
            onClick={() => inputRef.current?.click()}
            title="Upload image"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </button>
          {!isDefault && (
            <>
              <button
                className="banner-btn"
                onClick={() => setShowSettings(prev => !prev)}
                title="Position"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
                </svg>
              </button>
              <button
                className="banner-btn banner-remove"
                onClick={handleRemove}
                title="Reset to default"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
              </button>
            </>
          )}
        </div>
      )}

      {/* Position settings panel */}
      {showSettings && (
        <div className="banner-settings" onClick={e => e.stopPropagation()}>
          <span className="banner-settings-title">Position</span>
          <div className="banner-settings-options">
            {POSITION_OPTIONS.map(p => (
              <button
                key={p.id}
                className={`banner-settings-btn ${position === p.id ? 'active' : ''}`}
                onClick={() => handlePositionChange(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
    </div>
  )
}

export default BannerImage