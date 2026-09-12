import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import { connectDB } from './config/db.js'

import authRoutes from './routes/auth.routes.js'
import listingsRoutes from './routes/listings.routes.js'
import bookingsRoutes from './routes/bookings.routes.js'
import paymentsRoutes from './routes/payments.routes.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/listings', listingsRoutes)
app.use('/api/bookings', bookingsRoutes)
app.use('/api/payments', paymentsRoutes)

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: `No route: ${req.method} ${req.originalUrl}` })
})

// Central error handler — catches anything thrown/rejected in a route
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong.' })
})

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Wayfare API running on http://localhost:${PORT}`))
})
