import { useState } from 'react'
import { getT } from '../i18n'

function StartupModal({ onClose, lang }) {
  const t = getT(lang)
  const [checked, setChecked] = useState(false)

  const handleConfirm = () => {
    window.electronAPI?.setLoginItem(checked)
    onClose()
  }

  const handleSkip = () => {
    window.electronAPI?.dismissStartupPrompt()
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t.welcomeTitle}</h2>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.6 }}>
            {t.welcomeDesc}
          </p>

          <label className="startup-checkbox-row">
            <input
              type="checkbox"
              checked={checked}
              onChange={e => setChecked(e.target.checked)}
              style={{ accentColor: 'var(--color-primary)', width: '1rem', height: '1rem' }}
            />
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
              {t.launchOnStartup}
            </span>
          </label>

          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-light)', lineHeight: 1.5 }}>
            {t.startupNote}
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={handleSkip}>{t.skip}</button>
          <button className="btn-submit" onClick={handleConfirm}>{t.confirm}</button>
        </div>
      </div>
    </div>
  )
}

export default StartupModal