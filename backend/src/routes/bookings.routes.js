import { Router } from 'express'
import {
  createBooking,
  getMyBookings,
  getHostBookings,
  getBookingByCode,
  cancelBooking,
} from '../controllers/bookings.controller.js'
import { requireAuth, requireRole, attachUserIfPresent } from '../middleware/auth.js'

const router = Router()

// Guest checkout is allowed, but if a valid token is sent, the booking gets linked to that user
router.post('/', attachUserIfPresent, createBooking)
router.get('/mine', requireAuth, getMyBookings)

// Must come before /:confirmationCode, or Express will treat "host" as a code to look up
router.get('/host', requireAuth, requireRole('host', 'admin'), getHostBookings)

// Same reason — must come before /:confirmationCode
router.patch('/:id/cancel', requireAuth, cancelBooking)

router.get('/:confirmationCode', getBookingByCode)

export default router