import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import Icon from '../components/Icon.jsx'

export default function HostBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getHostBookings()
      .then((data) => setBookings(data.bookings || []))
      .catch((err) => setError(err.message || 'Could not load your bookings.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center text-ink/50">
        Loading reservations…
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-coral">{error}</p>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="font-display text-2xl mb-4">No reservations yet.</p>
        <p className="text-ink/60 mb-6">
          Once someone books one of your properties, it'll show up here.
        </p>
        <Link to="/admin/listings/new" className="underline text-teal">
          Add a property
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="text-sm uppercase tracking-widest text-ink/50 mb-3">
        Host dashboard
      </p>
      <h1 className="font-display text-4xl mb-10">
        Reservations on your properties.
      </h1>

      <div className="space-y-4">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="border border-line rounded-2xl p-5 bg-parchmentDim flex items-center justify-between gap-4"
          >
            <div>
              <p className="font-display text-lg">
                {b.listing?.title || 'Listing'}
              </p>
              <p className="text-sm text-ink/60">{b.listing?.location}</p>

              <div className="flex items-center gap-4 mt-3 text-xs text-ink/60 font-mono">
                <span className="flex items-center gap-1">
                  <Icon name="calendar" className="w-3.5 h-3.5" />
                  {b.checkIn?.slice(0, 10)} → {b.checkOut?.slice(0, 10)}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="users" className="w-3.5 h-3.5" />
                  {b.guests} guest{b.guests === 1 ? '' : 's'}
                </span>
              </div>

              <p className="text-sm mt-2">
                Booked by <span className="font-medium">{b.guestName}</span>{' '}
                <span className="text-ink/50">({b.email})</span>
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-[10px] uppercase tracking-widest text-ink/40">
                Code
              </p>
              <p className="font-mono text-sm">{b.confirmationCode}</p>
              <p className="text-teal font-medium mt-2">₹{b.total}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}