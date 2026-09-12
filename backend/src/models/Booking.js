import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
  {
    confirmationCode: { type: String, required: true, unique: true }, // e.g. "WF-A1B2C3"
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional — guest checkout allowed

    guestName: { type: String, required: true },
    email: { type: String, required: true },

    // Guest can cancel their own upcoming trip; no refund logic yet —
    // this just tracks the booking's state.
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },

    checkIn: { type: String, required: true }, // stored as 'YYYY-MM-DD' to match <input type="date">
    checkOut: { type: String, required: true },
    guests: { type: Number, required: true },
    nights: { type: Number, required: true },

    pricePerNight: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    cleaningFee: { type: Number, required: true },
    serviceFee: { type: Number, required: true },
    total: { type: Number, required: true },

    // Real Razorpay payment references — we never touch or store card numbers ourselves.
    payment: {
      provider: { type: String, default: 'razorpay' },
      orderId: { type: String, required: true },
      paymentId: { type: String, required: true },
      status: { type: String, enum: ['paid'], default: 'paid' },
    },
  },
  { timestamps: true }
)

export default mongoose.model('Booking', bookingSchema)