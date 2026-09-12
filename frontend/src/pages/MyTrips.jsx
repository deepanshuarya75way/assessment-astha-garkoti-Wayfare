import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import Icon from '../components/Icon.jsx'

export default function MyTrips() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    api
      .getMyBookings()
      .then((data) => setBookings(data.bookings || []))
      .catch((err) => setError(err.message || 'Could not load your trips.'))
      .finally(() => setLoading(false))
  }, [])

  function isUpcoming(booking) {
    const today = new Date().toISOString().slice(0, 10)
    return booking.checkIn?.slice(0, 10) > today
  }

  async function handleCancel(bookingId) {
    if (!window.confirm('Cancel this trip? This can\'t be undone.')) return

    setActionError('')
    setCancellingId(bookingId)
    try {
      const { booking } = await api.cancelBooking(bookingId)
      setBookings((prev) => prev.map((b) => (b._id === bookingId ? booking : b)))
    } catch (err) {
      setActionError(err.message || 'Could not cancel this trip.')
    } finally {
      setCancellingId(null)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center text-ink/50">
        Loading your trips…
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
        <p className="font-display text-2xl mb-4">No trips booked yet.</p>
        <p className="text-ink/60 mb-6">
          Once you book a stay, it'll show up here.
        </p>
        <Link to="/explore" className="underline text-teal">
          Browse stays
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="text-sm uppercase tracking-widest text-ink/50 mb-3">
        Your trips
      </p>
      <h1 className="font-display text-4xl mb-10">
        Everywhere you've stayed with Wayfare.
      </h1>

      {actionError && <p className="text-coral text-sm mb-6">{actionError}</p>}

      <div className="space-y-6">
        {bookings.map((b) => (
          <div
            key={b._id}
            className={`relative bg-teal text-parchment rounded-2xl shadow-ticket overflow-hidden ticket-notch ${
              b.status === 'cancelled' ? 'opacity-50' : ''
            }`}
            style={{ '--notch-top': '50%', '--notch-bg': '#FBF7EE' }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between font-mono text-xs text-parchment/50 tracking-widest uppercase">
                <span className="flex items-center gap-1.5">
                  <Icon name="ticket" className="w-3.5 h-3.5" />
                  Wayfare boarding pass
                </span>
                <span className="flex items-center gap-2">
                  {b.status === 'cancelled' && (
                    <span className="text-coral normal-case tracking-normal">Cancelled</span>
                  )}
                  {b.confirmationCode}
                </span>
              </div>

              <h2 className="font-display text-2xl mt-3">
                {b.listing?.title || 'Stay'}
              </h2>
              <p className="text-parchment/70 text-sm">
                {b.listing?.location}
              </p>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-parchment/50">
                    Check in
                  </span>
                  <p className="font-mono mt-1">{b.checkIn?.slice(0, 10)}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-parchment/50">
                    Check out
                  </span>
                  <p className="font-mono mt-1">{b.checkOut?.slice(0, 10)}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-parchment/50">
                    Guests
                  </span>
                  <p className="font-mono mt-1">{b.guests}</p>
                </div>
              </div>
            </div>

            <div
              className="bg-parchment/20"
              style={{ height: 0, borderTop: '2px dashed rgba(251,247,238,0.25)' }}
            />

            <div className="p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-parchment/50">
                  Payment
                </span>
                <p className="font-mono mt-1">Paid via Razorpay</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest text-parchment/50">
                  Total
                </span>
                <p className="font-mono mt-1">₹{b.total}</p>
              </div>
            </div>

            {b.status !== 'cancelled' && isUpcoming(b) && (
              <div className="px-6 pb-6">
                <button
                  onClick={() => handleCancel(b._id)}
                  disabled={cancellingId === b._id}
                  className="text-sm px-4 py-2 rounded-full border border-parchment/40 text-parchment hover:bg-parchment/10 transition-colors disabled:opacity-50"
                >
                  {cancellingId === b._id ? 'Cancelling…' : 'Cancel trip'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}