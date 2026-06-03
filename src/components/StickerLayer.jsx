import { useState, useRef, useEffect } from 'react'

const DEFAULT_SIZE = 100

function StickerLayer({ pageKey, stickerMode }) {
  const [stickers, setStickers] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [resizing, setResizing] = useState(null)
  const layerRef = useRef(null)

  useEffect(() => {
  const handleCleared = (e) => {
    if (e.detail.pageKey === pageKey) {
      setStickers([])
      setSelectedId(null)
    }
  }
  window.addEventListener('stickers-cleared', handleCleared)
  return () => window.removeEventListener('stickers-cleared', handleCleared)
}, [pageKey])

  useEffect(() => {
    localStorage.setItem(`momo-stickers-placed-${pageKey}`, JSON.stringify(stickers))
  }, [stickers, pageKey])

  // Resize mouse events
  useEffect(() => {
    if (!resizing) return

    const handleMouseMove = (e) => {
      const { id, startX, startY, startW, startH } = resizing
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      const delta = Math.max(dx, dy)
      const newSize = Math.max(40, Math.min(300, startW + delta))
      setStickers(prev => prev.map(s =>
        s.id === id ? { ...s, size: Math.round(newSize) } : s
      ))
    }

    const handleMouseUp = () => {
      setResizing(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [resizing])

  const handleDragOver = (e) => e.preventDefault()

  const handleDrop = (e) => {
    e.preventDefault()

    const placedId = e.dataTransfer.getData('placed-sticker')
    if (placedId) {
      const id = parseInt(placedId)
      const rect = layerRef.current.getBoundingClientRect()
      const sticker = stickers.find(s => s.id === id)
      if (!sticker) return
      const px = sticker.size || DEFAULT_SIZE
      const x = e.clientX - rect.left - px / 2
      const y = e.clientY - rect.top - px / 2
      setStickers(prev => prev.map(s =>
        s.id === id ? { ...s, x: Math.max(0, x), y: Math.max(0, y) } : s
      ))
      return
    }

    const data = e.dataTransfer.getData('sticker')
    if (data) {
      const { src } = JSON.parse(data)
      const rect = layerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - DEFAULT_SIZE / 2
      const y = e.clientY - rect.top - DEFAULT_SIZE / 2
      setStickers(prev => [...prev, {
        id: Date.now(),
        src,
        size: DEFAULT_SIZE,
        x: Math.max(0, x),
        y: Math.max(0, y),
      }])
    }
  }

  const handleStickerDragStart = (e, id) => {
    e.dataTransfer.setData('placed-sticker', String(id))
    setSelectedId(id)
  }

  const handleDelete = (id) => {
    setStickers(prev => prev.filter(s => s.id !== id))
    setSelectedId(null)
  }

  const handleResizeStart = (e, sticker) => {
    e.stopPropagation()
    e.preventDefault()
    setResizing({
      id: sticker.id,
      startX: e.clientX,
      startY: e.clientY,
      startW: sticker.size || DEFAULT_SIZE,
      startH: sticker.size || DEFAULT_SIZE,
    })
  }

  const handleLayerClick = (e) => {
    if (e.target === layerRef.current) setSelectedId(null)
  }

  return (
    <div
      ref={layerRef}
      className="sticker-layer"
      onClick={handleLayerClick}
    >
      {stickers.map(sticker => {
        const px = sticker.size || DEFAULT_SIZE
        const isSelected = selectedId === sticker.id
        return (
          <div
            key={sticker.id}
            className={`sticker-item ${isSelected && stickerMode ? 'selected' : ''}`}
            style={{
              left: sticker.x,
              top: sticker.y,
              width: px,
              height: px,
              pointerEvents: stickerMode ? 'all' : 'none',
              cursor: stickerMode ? 'grab' : 'default',
            }}
            draggable={stickerMode && !resizing}
            onDragStart={e => handleStickerDragStart(e, sticker.id)}
            onClick={e => {
              e.stopPropagation()
              if (stickerMode) setSelectedId(isSelected ? null : sticker.id)
            }}
          >
            <img
              src={sticker.src}
              alt="sticker"
              style={{ width: '100%', height: '100%', objectFit: 'contain', userSelect: 'none' }}
              draggable={false}
            />
            {isSelected && stickerMode && (
              <>
                {/* Delete button */}
                <button
                  className="sticker-delete-btn"
                  onClick={e => { e.stopPropagation(); handleDelete(sticker.id) }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
                {/* Resize handle */}
                <div
                  className="sticker-resize-handle"
                  onMouseDown={e => handleResizeStart(e, sticker)}
                >
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
                    <path d="M9 1L1 9M5 9L9 9L9 5"/>
                  </svg>
                </div>
              </>
            )}
          </div>
        )
      })}

      {stickerMode && (
        <div
          className="sticker-drop-hint"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      )}
    </div>
  )
}

export default StickerLayer