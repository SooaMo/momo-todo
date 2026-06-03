import { useState } from 'react'

function StartupModal({ onClose }) {
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
          <h2 className="modal-title">Welcome to MomoTodo 🎉</h2>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.6 }}>
            MomoTodo is ready to use! Would you like to launch it automatically when you start your computer?
          </p>

          <label className="startup-checkbox-row">
            <input
              type="checkbox"
              checked={checked}
              onChange={e => setChecked(e.target.checked)}
              style={{ accentColor: 'var(--color-primary)', width: '1rem', height: '1rem' }}
            />
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
              Launch MomoTodo on startup
            </span>
          </label>

          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-light)', lineHeight: 1.5 }}>
            You can change this anytime in Settings.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={handleSkip}>Skip</button>
          <button className="btn-submit" onClick={handleConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  )
}

export default StartupModal