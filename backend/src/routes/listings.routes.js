import { Router } from 'express'

import {
  getListings,
  getListingById,
  createListing,
} from '../controllers/listings.controller.js'

import upload from '../middleware/upload.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.get('/', getListings)
router.get('/:id', getListingById)

router.post(
  '/',
  requireAuth,
  requireRole('host', 'admin'),
  upload.single('image'),
  createListing
)

export default router