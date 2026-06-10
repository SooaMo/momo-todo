import { useState, useRef, useEffect } from 'react'

const DEFAULT_SIZE = 100

function StickerLayer({ pageKey, stickerMode }) {
  const [stickers, setStickers] = useState(() => {
    try {
      const saved = localStorage.getItem(`momo-stickers-placed-${pageKey}`)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [selectedId, setSelectedId] = useState(null)
  const [resizing, setResizing] = useState(null)
  const [rotating, setRotating] = useState(null)
  const [dragging, setDragging] = useState(null) // { id, offsetX, offsetY }
  const layerRef = useRef(null)
  const pageKeyRef = useRef(pageKey)
  const isLoadingRef = useRef(false)

  useEffect(() => {
    if (pageKeyRef.current !== pageKey) {
      pageKeyRef.current = pageKey
      isLoadingRef.current = true
      try {
        const saved = localStorage.getItem(`momo-stickers-placed-${pageKey}`)
        setStickers(saved ? JSON.parse(saved) : [])
      } catch {
        setStickers([])
      }
      setSelectedId(null)
      setTimeout(() => { isLoadingRef.current = false }, 0)
    }
  }, [pageKey])

  useEffect(() => {
    if (isLoadingRef.current) return
    localStorage.setItem(`momo-stickers-placed-${pageKey}`, JSON.stringify(stickers))
  }, [stickers, pageKey])

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

  // Drag (mouseMove 방식)
  useEffect(() => {
    if (!dragging) return
    const handleMouseMove = (e) => {
      const { id, offsetX, offsetY } = dragging
      const rect = layerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - offsetX
      const y = e.clientY - rect.top - offsetY
      setStickers(prev => prev.map(s =>
        s.id === id ? { ...s, x: Math.max(0, x), y: Math.max(0, y) } : s
      ))
    }
    const handleMouseUp = () => setDragging(null)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging])

  // Resize
  useEffect(() => {
    if (!resizing) return
    const handleMouseMove = (e) => {
      const { id, startX, startW } = resizing
      const dx = e.clientX - startX
      const newSize = Math.max(40, Math.min(300, startW + dx))
      setStickers(prev => prev.map(s =>
        s.id === id ? { ...s, size: Math.round(newSize) } : s
      ))
    }
    const handleMouseUp = () => setResizing(null)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [resizing])

  // Rotate
  useEffect(() => {
    if (!rotating) return
    const handleMouseMove = (e) => {
      const { id, centerX, centerY, startAngle, startRotation } = rotating
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)
      const delta = angle - startAngle
      const newRotation = (startRotation + delta + 360) % 360
      setStickers(prev => prev.map(s =>
        s.id === id ? { ...s, rotation: Math.round(newRotation) } : s
      ))
    }
    const handleMouseUp = () => setRotating(null)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [rotating])

  // 키보드 방향키 미세조정
  useEffect(() => {
    if (!selectedId) return
    const handleKeyDown = (e) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return
      e.preventDefault()
      const step = e.shiftKey ? 10 : 1
      setStickers(prev => prev.map(s => {
        if (s.id !== selectedId) return s
        return {
          ...s,
          x: e.key === 'ArrowLeft' ? s.x - step : e.key === 'ArrowRight' ? s.x + step : s.x,
          y: e.key === 'ArrowUp' ? s.y - step : e.key === 'ArrowDown' ? s.y + step : s.y,
        }
      }))
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId])

  // 라이브러리에서 드래그해서 새 스티커 드롭
  const handleDragOver = (e) => e.preventDefault()

  const handleDrop = (e) => {
    e.preventDefault()
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
        rotation: 0,
        x: Math.max(0, x),
        y: Math.max(0, y),
      }])
    }
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
      startW: sticker.size || DEFAULT_SIZE,
    })
  }

  const handleRotateStart = (e, sticker) => {
    e.stopPropagation()
    e.preventDefault()
    const rect = layerRef.current.getBoundingClientRect()
    const px = sticker.size || DEFAULT_SIZE
    const centerX = rect.left + sticker.x + px / 2
    const centerY = rect.top + sticker.y + px / 2
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)
    setRotating({
      id: sticker.id,
      centerX,
      centerY,
      startAngle,
      startRotation: sticker.rotation || 0,
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
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {stickers.map(sticker => {
        const px = sticker.size || DEFAULT_SIZE
        const isSelected = selectedId === sticker.id
        const rotation = sticker.rotation || 0
        const isDraggingThis = dragging?.id === sticker.id
        return (
          <div
            key={sticker.id}
            className={`sticker-item ${isSelected && stickerMode ? 'selected' : ''}`}
            style={{
              left: sticker.x,
              top: sticker.y,
              width: px,
              height: px,
              transform: `rotate(${rotation}deg)`,
              pointerEvents: stickerMode ? 'all' : 'none',
              cursor: isDraggingThis ? 'grabbing' : stickerMode ? 'grab' : 'default',
            }}
           onMouseDown={e => {
  if (!stickerMode) return
  if (e.target.closest('.sticker-handle')) return
  e.stopPropagation()

  const startX = e.clientX
  const startY = e.clientY
  const rect = layerRef.current.getBoundingClientRect()
  const offsetX = e.clientX - rect.left - sticker.x
  const offsetY = e.clientY - rect.top - sticker.y
  let didDrag = false

  const onMouseMove = (moveE) => {
    if (!didDrag && (Math.abs(moveE.clientX - startX) > 5 || Math.abs(moveE.clientY - startY) > 5)) {
      didDrag = true
      setDragging({ id: sticker.id, offsetX, offsetY })
    }
  }
  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
    if (!didDrag) {
      // 드래그 없이 클릭 → 선택/해제 토글
      setSelectedId(prev => prev === sticker.id ? null : sticker.id)
    }
  }
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}}
          >
            <img
              src={sticker.src}
              alt="sticker"
              style={{ width: '100%', height: '100%', objectFit: 'contain', userSelect: 'none', pointerEvents: 'none' }}
              draggable={false}
            />
            {isSelected && stickerMode && (
              <>
                {/* Delete button - top left */}
                <button
                  className="sticker-handle sticker-delete-btn"
                  onClick={e => { e.stopPropagation(); handleDelete(sticker.id) }}
                  title="Delete"
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>

                {/* Rotate handle - top right */}
                <div
                  className="sticker-handle sticker-rotate-handle"
                  onMouseDown={e => handleRotateStart(e, sticker)}
                  title="Rotate"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 2v6h-6"/>
                    <path d="M3 12a9 9 0 0 1 15-6.7L21 8"/>
                  </svg>
                </div>

                {/* Resize handle - bottom right */}
                <div
                  className="sticker-handle sticker-resize-handle"
                  onMouseDown={e => handleResizeStart(e, sticker)}
                  title="Resize"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(90deg)' }}>
                    <line x1="5" y1="19" x2="19" y2="5"/>
                    <polyline points="5 11 5 19 13 19"/>
                    <polyline points="11 5 19 5 19 13"/>
                  </svg>
                </div>
              </>
            )}
          </div>
        )
      })}

      {stickerMode && <div className="sticker-drop-hint" />}
    </div>
  )
}

export default StickerLayer