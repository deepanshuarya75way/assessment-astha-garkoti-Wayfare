import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('Render error caught by ErrorBoundary:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/explore'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          <p className="font-display text-2xl mb-3">Something went wrong.</p>
          <p className="text-ink/50 mb-6">
            {this.state.error?.message || 'This page hit an unexpected error.'}
          </p>
          <button
            onClick={this.handleReset}
            className="bg-coral text-parchment px-6 py-3 rounded-full font-medium hover:bg-coral/90 transition-colors"
          >
            Back to all stays
          </button>
        </div>
      )
    }
    return this.props.children
  }
}