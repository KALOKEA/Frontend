'use client'
import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; message: string }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err.message || 'Something went wrong' }
  }

  componentDidCatch(err: Error) {
    // Could send to Sentry here when DSN is configured
    console.error('[ErrorBoundary]', err)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
          <h2 className="font-serif text-2xl text-[#0a0a0a] mb-3">Something went wrong</h2>
          <p className="text-sm text-[#6b6b6b] mb-6 max-w-sm">{this.state.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, message: '' })}
            className="px-6 py-2.5 text-[11px] uppercase tracking-widest bg-[#0a0a0a] text-white hover:bg-[#333]"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
