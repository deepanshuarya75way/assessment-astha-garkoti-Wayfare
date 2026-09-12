import crypto from 'crypto'
import Booking from '../models/Booking.js'
import Listing from '../models/Listing.js'
import { computeTotal } from './payments.controller.js'

function generateConfirmationCode() {
  return 'WF-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

function paymentSignatureIsValid({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')
  return expected === razorpay_signature
}

// POST /api/bookings
// Body: { listingId, checkIn, checkOut, guests, guestName, email,
//         razorpay_order_id, razorpay_payment_id, razorpay_signature }
export async function createBooking(req, res) {
  const {
    listingId,
    checkIn,
    checkOut,
    guests,
    guestName,
    email,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body

  if (!listingId || !checkIn || !checkOut || !guestName || !email) {
    return res.status(400).json({ message: 'Missing required booking details.' })
  }
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(402).json({ message: 'Payment was not completed.' })
  }
  if (!paymentSignatureIsValid({ razorpay_order_id, razorpay_payment_id, razorpay_signature })) {
    return res.status(402).json({ message: 'Payment could not be verified.' })
  }

  // Recompute price on the server so nothing the client sends can change the amount charged.
  const { listing, nights, subtotal, cleaningFee, serviceFee, total } = await computeTotal({
    listingId,
    checkIn,
    checkOut,
  })

  if (guests && guests > listing.guests) {
    return res.status(400).json({ message: `This place fits up to ${listing.guests} guests.` })
  }

  const booking = await Booking.create({
    confirmationCode: generateConfirmationCode(),
    listing: listing._id,
    user: req.userId || undefined,
    guestName,
    email,
    checkIn,
    checkOut,
    guests: guests || 1,
    nights,
    pricePerNight: listing.price,
    subtotal,
    cleaningFee,
    serviceFee,
    total,
    payment: {
      provider: 'razorpay',
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      status: 'paid',
    },
  })

  const populated = await booking.populate('listing')
  res.status(201).json({ booking: populated })
}

// PATCH /api/bookings/:id/cancel — requires auth; only the guest who booked it can cancel
export async function cancelBooking(req, res) {
  const booking = await Booking.findById(req.params.id)

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' })
  }

  if (!booking.user || booking.user.toString() !== req.userId) {
    return res.status(403).json({ message: 'You can only cancel your own bookings.' })
  }

  if (booking.status === 'cancelled') {
    return res.status(400).json({ message: 'This booking is already cancelled.' })
  }

  const today = new Date().toISOString().slice(0, 10)
  if (booking.checkIn <= today) {
    return res.status(400).json({ message: 'This trip has already started or passed — it can no longer be cancelled.' })
  }

  booking.status = 'cancelled'
  await booking.save()

  const populated = await booking.populate('listing')
  res.json({ booking: populated })
}

// GET /api/bookings/mine — requires auth
export async function getMyBookings(req, res) {
  const bookings = await Booking.find({ user: req.userId })
    .populate('listing')
    .sort({ createdAt: -1 })
  res.json({ bookings })
}

// GET /api/bookings/host — every booking made on properties owned by the logged-in host
export async function getHostBookings(req, res) {
  const myListings = await Listing.find({ host: req.userId }).select('_id')
  const listingIds = myListings.map((l) => l._id)

  const bookings = await Booking.find({ listing: { $in: listingIds } })
    .populate('listing')
    .sort({ createdAt: -1 })

  res.json({ bookings })
}

// GET /api/bookings/:confirmationCode — look up a single booking (e.g. for a confirmation page)
export async function getBookingByCode(req, res) {
  const booking = await Booking.findOne({
    confirmationCode: req.params.confirmationCode,
  }).populate('listing')
  if (!booking) {
    return res.status(404).json({ message: 'No booking found with that confirmation code.' })
  }
  res.json({ booking })
}