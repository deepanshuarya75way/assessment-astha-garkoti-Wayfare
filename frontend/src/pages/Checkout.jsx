import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useBooking } from '../context/BookingContext.jsx'
import Icon from '../components/Icon.jsx'

function nights(a, b) {
  const diff = Math.round((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

// Injects the Razorpay checkout script once and resolves when it's ready.
function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve()
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Could not load the payment SDK. Check your connection.'))
    document.body.appendChild(script)
  })
}

export default function Checkout() {
  const { trip, user, confirmOrder } = useBooking()
  const navigate = useNavigate()

  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [step, setStep] = useState('details') // details -> paying -> confirmed
  const [error, setError] = useState('')
  const [confirmation, setConfirmation] = useState(null)

  useEffect(() => {
    if (!trip.listingId) {
      setLoading(false)
      return
    }
    api
      .getListing(trip.listingId)
      .then((data) => setListing(data.listing))
      .catch(() => setListing(null))
      .finally(() => setLoading(false))
  }, [trip.listingId])

  const n = useMemo(() => (listing ? nights(trip.checkIn, trip.checkOut) : 0), [listing, trip])
  const subtotal = n * (listing?.price || 0)
  const cleaningFee = n > 0 ? 32 : 0
  const serviceFee = Math.round(subtotal * 0.12)
  const total = subtotal + cleaningFee + serviceFee

  if (loading) {
    return <div className="max-w-2xl mx-auto px-6 py-24 text-center text-ink/50">Loading…</div>
  }

  if (!listing || !n) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="font-display text-2xl mb-4">Nothing to check out yet.</p>
        <p className="text-ink/60 mb-6">Pick a stay and reserve your dates first.</p>
        <Link to="/explore" className="underline text-teal">
          Browse stays
        </Link>
      </div>
    )
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handlePay(e) {
    e.preventDefault()
    if (!form.name || !form.email) {
      setError('Fill in your name and email.')
      return
    }
    setError('')
    setStep('paying')

    try {
      await loadRazorpayScript()

      // 1. Ask the backend to create a Razorpay order. The backend recalculates
      //    the total itself — it never trusts an amount from the browser.
      const order = await api.createPaymentOrder({
        listingId: listing._id || listing.id,
        checkIn: trip.checkIn,
        checkOut: trip.checkOut,
      })

      // 2. Open Razorpay's checkout modal for the user to actually pay.
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'Wayfare',
        description: listing.title,
        prefill: { name: form.name, email: form.email },
        theme: { color: '#1F6F5C' },
        handler: async (response) => {
          try {
            // 3. Once Razorpay confirms payment, create the booking on our backend,
            //    which independently re-verifies the payment signature.
            const { booking } = await api.createBooking({
              listingId: listing._id || listing.id,
              checkIn: trip.checkIn,
              checkOut: trip.checkOut,
              guests: trip.guests,
              guestName: form.name,
              email: form.email,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            confirmOrder(booking)
            setConfirmation(booking)
            setStep('confirmed')
          } catch (err) {
            setError(err.message || 'Payment succeeded but the booking could not be saved.')
            setStep('details')
          }
        },
        modal: {
          ondismiss: () => setStep('details'),
        },
      })

      rzp.on('payment.failed', (resp) => {
        setError(resp.error?.description || 'Payment failed. Please try again.')
        setStep('details')
      })

      rzp.open()
    } catch (err) {
      setError(err.message || 'Could not start the payment.')
      setStep('details')
    }
  }

  if (step === 'confirmed' && confirmation) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-teal text-marigold flex items-center justify-center mx-auto mb-4 animate-stamp">
            <Icon name="check" className="w-7 h-7" />
          </div>
          <h1 className="font-display text-3xl">Booked. Bags out.</h1>
          <p className="text-ink/60 mt-1">A confirmation was sent to {confirmation.email}.</p>
        </div>

        {/* Boarding pass */}
        <div
          className="relative bg-teal text-parchment rounded-2xl shadow-ticket overflow-hidden ticket-notch"
          style={{ '--notch-top': '50%', '--notch-bg': '#FBF7EE' }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between font-mono text-xs text-parchment/50 tracking-widest uppercase">
              <span>Wayfare boarding pass</span>
              <span>{confirmation.confirmationCode}</span>
            </div>
            <h2 className="font-display text-2xl mt-3">{listing.title}</h2>
            <p className="text-parchment/70 text-sm">{listing.location}</p>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-parchment/50">
                  Check in
                </span>
                <p className="font-mono mt-1">{confirmation.checkIn}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-parchment/50">
                  Check out
                </span>
                <p className="font-mono mt-1">{confirmation.checkOut}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-parchment/50">
                  Guests
                </span>
                <p className="font-mono mt-1">{confirmation.guests}</p>
              </div>
            </div>
          </div>

          <div className="dashed-divider bg-parchment/20" style={{ height: 0, borderTop: '2px dashed rgba(251,247,238,0.25)' }} />

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
              <p className="font-display text-2xl">₹{confirmation.total}</p>
            </div>
          </div>
        </div>

        <Link
          to="/explore"
          className="block text-center mt-8 text-sm underline text-teal"
        >
          Back to browsing more stays
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-10">
      <Link to={`/listing/${listing._id || listing.id}`} className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink mb-6">
        <Icon name="arrowLeft" className="w-4 h-4" />
        Back to listing
      </Link>

      <h1 className="font-display text-3xl mb-8">Confirm and pay</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <form onSubmit={handlePay} className="lg:col-span-2 space-y-8">
          <div>
            <h3 className="font-display text-xl mb-4">Your details</h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs text-ink/50">Full name</span>
                <input
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  className="w-full mt-1 border border-line rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal"
                  placeholder="Jordan Rivera"
                />
              </label>
              <label className="block">
                <span className="text-xs text-ink/50">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="w-full mt-1 border border-line rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal"
                  placeholder="you@example.com"
                />
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Icon name="card" className="w-5 h-5 text-teal" />
              <h3 className="font-display text-xl">Payment</h3>
              <span className="text-[10px] font-mono uppercase tracking-widest bg-marigold/20 text-teal px-2 py-1 rounded-full">
                Secured by Razorpay
              </span>
            </div>
            <p className="text-sm text-ink/60">
              You'll enter your card, UPI, or wallet details in Razorpay's secure checkout
              window — this site never sees or stores your payment details.
            </p>
          </div>

          {error && <p className="text-coral text-sm">{error}</p>}

          <button
            type="submit"
            disabled={step === 'paying'}
            className="w-full bg-coral text-parchment py-3.5 rounded-full font-medium hover:bg-coral/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {step === 'paying' ? (
              <>
                <span className="w-4 h-4 border-2 border-parchment/40 border-t-parchment rounded-full animate-spin" />
                Opening secure checkout
              </>
            ) : (
              `Pay ₹${total} and confirm`
            )}
          </button>
          <p className="text-xs text-ink/40 flex items-center gap-1.5">
            <Icon name="shield" className="w-3.5 h-3.5" />
            Payments are processed by Razorpay; card details never touch this server.
          </p>
        </form>

        {/* Order summary */}
        <div>
          <div className="bg-parchment border border-line rounded-2xl shadow-ticket p-6 sticky top-28">
            <div className="flex gap-3">
              <img
                src={listing.images[0]}
                className="w-20 h-20 rounded-xl object-cover"
                alt=""
              />
              <div>
                <p className="font-display leading-snug">{listing.title}</p>
                <p className="text-xs text-ink/50 mt-1">{listing.location}</p>
                <span className="flex items-center gap-1 text-xs mt-1">
                  <Icon name="star" className="w-3.5 h-3.5 text-marigold fill-marigold" />
                  {listing.rating}
                </span>
              </div>
            </div>

            <div className="dashed-divider my-5" />

            <div className="space-y-2 text-sm text-ink/70">
              <div className="flex justify-between">
                <span>
                  ₹{listing.price} × {n} nights
                </span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Cleaning fee</span>
                <span>₹{cleaningFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>₹{serviceFee}</span>
              </div>
              <div className="dashed-divider my-2" />
              <div className="flex justify-between font-medium text-ink">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
