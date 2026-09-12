import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext.jsx'
import Icon from '../components/Icon.jsx'
import { api } from '../lib/api.js'

export default function Login() {
  const { login } = useBooking()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if (!email || !password) {
      setError('Enter your email and password.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const data = await api.login({ email, password })

      localStorage.setItem('wayfare_token', data.token)
      login(data.user)

      const from = location.state?.from
      navigate(from || '/explore')
    } catch (error) {
      console.error('Login error:', error)
      setError(error.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <div className="text-center mb-8">
        <span className="w-10 h-10 rounded-full bg-teal flex items-center justify-center text-marigold font-display italic text-xl mx-auto mb-4">
          w
        </span>

        <h1 className="font-display text-3xl">
          Welcome back
        </h1>

        <p className="text-ink/50 text-sm mt-1">
          Log in to manage your trips.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-parchment border border-line rounded-2xl shadow-ticket p-6 space-y-4"
      >
        <label className="block">
          <span className="text-xs text-ink/50">
            Email
          </span>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 border border-line rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal"
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="block">
          <span className="text-xs text-ink/50">
            Password
          </span>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 border border-line rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal"
            placeholder="••••••••"
            required
          />
        </label>

        {error && (
          <p className="text-coral text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal text-parchment py-3 rounded-full font-medium hover:bg-teal-light transition-colors disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>

        <p className="text-xs text-ink/40 flex items-center gap-1.5 justify-center">
          <Icon name="shield" className="w-3.5 h-3.5" />
          Your account is securely authenticated.
        </p>
      </form>

      <p className="text-center text-sm text-ink/60 mt-6">
        New to Wayfare?{' '}
        <Link to="/signup" className="text-teal underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}