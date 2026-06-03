import { useRef, useState } from 'react'

function StickerPanel({ onClose, pageKey }) {
  const inputRef = useRef(null)
  const [stickers, setStickers] = useState(() => {
    try {
      const saved = localStorage.getItem('momo-sticker-library')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  const handleUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const newSticker = { id: Date.now() + Math.random(), src: ev.target.result }
        setStickers(prev => {
          const updated = [...prev, newSticker]
          localStorage.setItem('momo-sticker-library', JSON.stringify(updated))
          return updated
        })
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemove = (id) => {
    setStickers(prev => {
      const updated = prev.filter(s => s.id !== id)
      localStorage.setItem('momo-sticker-library', JSON.stringify(updated))
      return updated
    })
  }

  const handleDragStart = (e, sticker) => {
    e.dataTransfer.setData('sticker', JSON.stringify({ src: sticker.src }))
  }

  const handleClearPage = () => {
  if (!window.confirm(`Clear all stickers on this page?`)) return
  localStorage.setItem(`momo-stickers-placed-${pageKey}`, JSON.stringify([]))
  window.dispatchEvent(new CustomEvent('stickers-cleared', { detail: { pageKey } }))
}

  const pageLabel = {
    'today': 'Today',
    'calendar-month': 'Calendar Month',
    'calendar-week': 'Calendar Week',
  }[pageKey] || pageKey

  return (
    <div className="sticker-side-panel">
      <div className="sticker-panel-header">
        <span className="sticker-panel-title">Stickers</span>
        <button className="topbar-btn" onClick={onClose} title="Close">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <p className="sticker-hint">Drag stickers onto the app. Select to resize or delete.</p>

      <div className="sticker-library">
        {stickers.length === 0 ? (
          <p className="sticker-empty">No stickers yet!<br/>Upload some below.</p>
        ) : (
          stickers.map(sticker => (
            <div
              key={sticker.id}
              className="sticker-thumb"
              draggable
              onDragStart={e => handleDragStart(e, sticker)}
            >
              <img src={sticker.src} alt="sticker" draggable={false} />
              <button className="sticker-thumb-delete" onClick={() => handleRemove(sticker.id)}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      <button className="sticker-upload-btn" onClick={() => inputRef.current?.click()}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        Upload
      </button>

      <button className="sticker-clear-btn" onClick={handleClearPage}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14H6L5 6"/>
          <path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4h6v2"/>
        </svg>
        Clear {pageLabel}
      </button>

      <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleUpload} />
    </div>
  )
}

export default StickerPanel