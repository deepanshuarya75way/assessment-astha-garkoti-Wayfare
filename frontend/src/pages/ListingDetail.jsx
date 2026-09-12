import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useBooking } from '../context/BookingContext.jsx'
import Icon from '../components/Icon.jsx'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop'

function nightsBetween(a, b) {
  if (!a || !b) return 0
  const d1 = new Date(a)
  const d2 = new Date(b)
  const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { startTrip } = useBooking()

  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api
      .getListing(id)
      .then((data) => {
        if (!cancelled) setListing(data.listing)
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message || 'Could not load this listing.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut])
  const subtotal = nights * (listing?.price || 0)
  const cleaningFee = nights > 0 ? 32 : 0
  const serviceFee = Math.round(subtotal * 0.12)
  const total = subtotal + cleaningFee + serviceFee

  if (loading) {
    return <div className="max-w-3xl mx-auto px-6 py-24 text-center text-ink/50">Loading…</div>
  }

  if (loadError || !listing) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="font-display text-2xl mb-4">That listing has moved on.</p>
        {loadError && <p className="text-ink/50 mb-4">{loadError}</p>}
        <Link to="/explore" className="underline text-teal">
          Back to all stays
        </Link>
      </div>
    )
  }

  const listingId = listing._id || listing.id
  const hostName =
    typeof listing.host === 'string' && listing.host.trim() ? listing.host : 'Wayfare host'

  function handleReserve() {
    if (!checkIn || !checkOut) {
      setError('Pick your check-in and check-out dates.')
      return
    }
    if (nights <= 0) {
      setError('Check-out must be after check-in.')
      return
    }
    setError('')
    startTrip(listingId, { checkIn, checkOut, guests })
    navigate('/checkout')
  }

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
      <Link to="/explore" className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink mb-6">
        <Icon name="arrowLeft" className="w-4 h-4" />
        Back to stays
      </Link>

      <h1 className="font-display text-3xl md:text-4xl">{listing.title}</h1>
      <div className="flex items-center gap-4 mt-2 text-sm text-ink/60">
        <span className="flex items-center gap-1">
          <Icon name="star" className="w-4 h-4 text-marigold fill-marigold" />
          {listing.rating} · {listing.reviews} reviews
        </span>
        <span>{listing.location}</span>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 mt-6 rounded-2xl overflow-hidden h-[420px]">
        <img
          src={listing.images?.[0] || listing.images?.[1] || listing.images?.[2] || FALLBACK_IMAGE}
          className="col-span-2 row-span-2 object-cover w-full h-full"
          alt=""
        />
        <img
          src={listing.images?.[1] || listing.images?.[0] || FALLBACK_IMAGE}
          className="col-span-2 row-span-1 object-cover w-full h-full"
          alt=""
        />
        <img
          src={listing.images?.[2] || listing.images?.[0] || FALLBACK_IMAGE}
          className="col-span-2 row-span-1 object-cover w-full h-full"
          alt=""
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
        {/* Details */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-6 pb-6 border-b border-line text-sm text-ink/70">
            <span className="flex items-center gap-2">
              <Icon name="users" className="w-4 h-4 text-teal" /> {listing.guests} guests
            </span>
            <span className="flex items-center gap-2">
              <Icon name="bed" className="w-4 h-4 text-teal" /> {listing.beds} bed
            </span>
            <span className="flex items-center gap-2">
              <Icon name="bath" className="w-4 h-4 text-teal" /> {listing.baths} bath
            </span>
          </div>

          <div className="py-6 border-b border-line flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-teal text-parchment flex items-center justify-center font-display italic">
              {hostName ? hostName[0].toUpperCase() : '?'}
            </div>
            <div>
              <p className="font-medium">Hosted by {hostName}</p>
              {listing.hostSince && (
                <p className="text-sm text-ink/50">Host since {listing.hostSince}</p>
              )}
            </div>
          </div>

          <p className="py-6 border-b border-line text-ink/80 leading-relaxed">
            {listing.description}
          </p>

          <div className="py-6">
            <h3 className="font-display text-xl mb-4">What this place offers</h3>
            <div className="grid grid-cols-2 gap-3">
              {(listing.amenities || []).map((a) => (
                <span key={a} className="flex items-center gap-2 text-sm text-ink/70">
                  <Icon name="check" className="w-4 h-4 text-teal" />
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Booking widget */}
        <div>
          <div className="sticky top-28 bg-parchment border border-line rounded-2xl shadow-ticket p-6">
            <div className="flex items-baseline justify-between mb-4">
              <span className="font-display text-2xl">
                ${listing.price}
                <span className="text-sm text-ink/50 font-body"> / night</span>
              </span>
              <span className="flex items-center gap-1 text-sm">
                <Icon name="star" className="w-4 h-4 text-marigold fill-marigold" />
                {listing.rating}
              </span>
            </div>

            <div className="grid grid-cols-2 border border-line rounded-xl overflow-hidden divide-x divide-line">
              <label className="p-3">
                <span className="text-[10px] uppercase tracking-widest text-ink/40">
                  Check in
                </span>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="block w-full bg-transparent outline-none text-sm mt-1"
                />
              </label>
              <label className="p-3">
                <span className="text-[10px] uppercase tracking-widest text-ink/40">
                  Check out
                </span>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="block w-full bg-transparent outline-none text-sm mt-1"
                />
              </label>
            </div>

            <label className="block border border-t-0 border-line rounded-b-xl -mt-px p-3">
              <span className="text-[10px] uppercase tracking-widest text-ink/40">Guests</span>
              <input
                type="number"
                min={1}
                max={listing.guests}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="block w-full bg-transparent outline-none text-sm mt-1"
              />
            </label>

            {error && <p className="text-coral text-sm mt-3">{error}</p>}

            <button
              onClick={handleReserve}
              className="w-full mt-5 bg-coral text-parchment py-3 rounded-full font-medium hover:bg-coral/90 transition-colors"
            >
              Reserve
            </button>

            {nights > 0 && (
              <div className="mt-5 space-y-2 text-sm text-ink/70">
                <div className="flex justify-between">
                  <span>
                    ${listing.price} × {nights} night{nights > 1 ? 's' : ''}
                  </span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span>${cleaningFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>${serviceFee}</span>
                </div>
                <div className="dashed-divider my-2" />
                <div className="flex justify-between font-medium text-ink">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
            )}

            <p className="text-xs text-ink/40 text-center mt-4">
              You won't be charged yet
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}