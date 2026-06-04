import { useRef, useState } from 'react'
import catImg from '../assets/cat.png'

function BannerImage({ imageKey, className, onOpenSettings }) {
  const inputRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const saved = localStorage.getItem(imageKey)
  const visible = localStorage.getItem(`${imageKey}-visible`) !== 'false'
  
  const position = localStorage.getItem(`${imageKey}-position`) || 'right'
  const resize = localStorage.getItem(`${imageKey}-resize`) || 'fit'
  const text = localStorage.getItem(`${imageKey}-text`) ?? "let's get things done ✦"
  const textPosition = localStorage.getItem(`${imageKey}-text-position`) || 'left'
  const textColor = localStorage.getItem(`${imageKey}-text-color`) || '#000000'
  const textFont = localStorage.getItem(`${imageKey}-text-font`) || 'Pretendard'
  const bgColor = localStorage.getItem(`${imageKey}-bg-color`) || '#ffffff'
  const bgColorCustom = localStorage.getItem(`${imageKey}-bg-color-custom`) || '#ffffff'

  const resolvedBgColor = bgColor === 'custom'
    ? bgColorCustom
    : bgColor === 'none' ? undefined : bgColor

  if (!visible) return null

  const src = saved || catImg

  const getBgStyle = () => {
    const base = {
      backgroundImage: `url(${src})`,
      backgroundRepeat: 'no-repeat',
      backgroundColor: resolvedBgColor || undefined,
    }
    if (resize === 'tile') return { ...base, backgroundSize: 'auto', backgroundRepeat: 'repeat', backgroundPosition: 'center' }
    if (resize === 'fit') return { ...base, backgroundSize: 'contain', backgroundPosition: position }
    return { ...base, backgroundSize: 'cover', backgroundPosition: position }
  }

  const getTextStyle = () => {
    const base = {
      position: 'absolute',
      top: '50%',
      color: textColor,
    }
    if (textPosition === 'center') return { ...base, left: '50%', transform: 'translateY(-50%) translateX(-50%)', textAlign: 'center', width: '80%' }
    if (textPosition === 'right') return { ...base, right: '1rem', textAlign: 'right', transform: 'translateY(-50%)' }
    return { ...base, left: '1rem', textAlign: 'left', transform: 'translateY(-50%)' }
  }

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

  const handleRemove = (e) => {
    e.stopPropagation()
    localStorage.removeItem(imageKey)
    window.location.reload()
  }

  return (
    <div
      className={`banner-image ${className || ''}`}
      style={getBgStyle()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {text && (
        <div className="banner-text" style={{ ...getTextStyle(), fontFamily: textFont }}>
          {text}
        </div>
      )}

      {hovered && (
        <div className="banner-actions">
          <button className="banner-btn" onClick={onOpenSettings} title="Customize banner">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          {saved && (
            <button className="banner-btn banner-remove" onClick={handleRemove} title="Reset">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
            </button>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
    </div>
  )
}

export default BannerImage