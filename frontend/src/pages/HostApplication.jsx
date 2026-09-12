import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext.jsx'
import { api } from '../lib/api.js'

export default function HostApplication() {
  const navigate = useNavigate()
  const { login } = useBooking()

  const [form, setForm] = useState({
    phone: '',
    address: '',
    about: '',
  })

  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    setLoading(true)

    try {
      const data = await api.becomeHost()

      login(data.user) // updates role -> 'host' across the app

      alert('You are now a host — let\'s add your first property!')

      navigate('/admin/listings/new')
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-widest text-ink/50 mb-3">
          Become a host
        </p>

        <h1 className="font-display text-5xl italic text-ink mb-4">
          Share your place with the world.
        </h1>

        <p className="text-ink/60 max-w-xl">
          Tell us a little about yourself and your property to get started.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 border border-line rounded-3xl p-8 bg-parchment"
      >
        <div>
          <label className="block text-sm mb-2">
            Phone number
          </label>

          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="Your phone number"
            className="w-full px-4 py-3 rounded-xl border border-line bg-white outline-none focus:border-ink"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">
            Address
          </label>

          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Where are you located?"
            className="w-full px-4 py-3 rounded-xl border border-line bg-white outline-none focus:border-ink"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">
            Tell us about yourself
          </label>

          <textarea
            name="about"
            value={form.about}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Why would you like to become a host?"
            className="w-full px-4 py-3 rounded-xl border border-line bg-white outline-none focus:border-ink"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-teal text-parchment hover:bg-teal-light transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit host application'}
        </button>
      </form>
    </div>
  )
}