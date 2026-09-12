import { Router } from 'express'
import { createOrder, verifySignature } from '../controllers/payments.controller.js'

const router = Router()

router.post('/create-order', createOrder)
router.post('/verify', verifySignature)

export default router
