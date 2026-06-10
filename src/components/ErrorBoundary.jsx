import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  handleReset = () => {
    // 설정 관련 키만 초기화, todo 데이터는 유지
    const keysToReset = [
      'momo-theme',
      'momo-lang',
      'momo-banner-top-bg-color',
      'momo-banner-top-visible',
      'momo-banner-top-position',
      'momo-banner-top-resize',
      'momo-cal-active-types',
      'momo-cal-completion-filter',
      'momo-open-folders',
      'momo-expanded-ids',
    ]
    keysToReset.forEach(key => localStorage.removeItem(key))
    window.location.reload()
  }

  handleReport = () => {
    const version = 'v1.0.6'
    const errorMsg = this.state.error?.toString() || 'Unknown error'
    const subject = encodeURIComponent(`MomoTodo ${version} Error Report`)
    const body = encodeURIComponent(`Version: ${version}\n\nError:\n${errorMsg}\n\nWhat I was doing:\n(please describe what you did before this happened)`)
    window.electronAPI?.openExternal(`mailto:harvest0505@gmail.com?subject=${subject}&body=${body}`)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-box">
            <h2 className="error-boundary-title">Something went wrong</h2>
            <p className="error-boundary-desc">
              MomoTodo ran into an unexpected error. Your todo data is safe.
            </p>
            <p className="error-boundary-code">{this.state.error?.toString()}</p>
            <div className="error-boundary-actions">
              <button className="settings-help-btn" onClick={this.handleReport}>
                Report via Email
              </button>
              <button className="settings-help-btn danger" onClick={this.handleReset}>
                Reset settings & Restart
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary