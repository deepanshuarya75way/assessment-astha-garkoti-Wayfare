import crypto from 'crypto'
import Razorpay from 'razorpay'
import Listing from '../models/Listing.js'

let razorpay = null
function getClient() {
  if (!razorpay) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay keys are missing — set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env')
    }
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  }
  return razorpay
}

function nightsBetween(checkIn, checkOut) {
  const diff = Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

// Recompute the price on the server — never trust a total sent from the browser.
export async function computeTotal({ listingId, checkIn, checkOut }) {
  const listing = await Listing.findById(listingId)
  if (!listing) throw Object.assign(new Error('That listing no longer exists.'), { status: 404 })

  const nights = nightsBetween(checkIn, checkOut)
  if (nights <= 0) throw Object.assign(new Error('Check-out must be after check-in.'), { status: 400 })

  const subtotal = nights * listing.price
  const cleaningFee = 32
  const serviceFee = Math.round(subtotal * 0.12)
  const total = subtotal + cleaningFee + serviceFee

  return { listing, nights, subtotal, cleaningFee, serviceFee, total }
}

// POST /api/payments/create-order
// Body: { listingId, checkIn, checkOut }
export async function createOrder(req, res) {
  const { listingId, checkIn, checkOut } = req.body
  if (!listingId || !checkIn || !checkOut) {
    return res.status(400).json({ message: 'Missing listingId, checkIn or checkOut.' })
  }

  const { total } = await computeTotal({ listingId, checkIn, checkOut })

  const order = await getClient().orders.create({
    amount: Math.round(total * 100), // Razorpay wants the amount in paise
    currency: 'INR',
    receipt: `wf_${Date.now()}`,
  })

  res.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  })
}

// POST /api/payments/verify
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
// Confirms the payment really came from Razorpay before your booking code trusts it.
export function verifySignature(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ message: 'Missing payment verification fields.' })
  }

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expected !== razorpay_signature) {
    return res.status(400).json({ verified: false, message: 'Payment verification failed.' })
  }

  res.json({ verified: true })
}
