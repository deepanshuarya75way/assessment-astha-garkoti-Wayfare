import User from '../models/User.js'
import jwt from 'jsonwebtoken'

function getTokenFromHeader(req) {
  const header = req.headers.authorization || ''
  if (!header.startsWith('Bearer ')) return null
  return header.slice('Bearer '.length)
}

// Blocks the request if there's no valid token
export function requireAuth(req, res, next) {
  const token = getTokenFromHeader(req)
  if (!token) {
    return res.status(401).json({ message: 'Log in to continue.' })
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = payload.sub
    next()
  } catch {
    return res.status(401).json({ message: 'Your session expired — log in again.' })
  }
}

// Attaches req.userId if a valid token is present, but never blocks the request.
// Used for checkout, which supports guest bookings.
export function attachUserIfPresent(req, _res, next) {
  const token = getTokenFromHeader(req)
  if (!token) return next()
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = payload.sub
  } catch {
    // invalid/expired token on an optional route — just proceed as a guest
  }
  next()
}


export function requireRole(...roles) {
  return async (req, res, next) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          message: 'Log in to continue.',
        })
      }

      const user = await User.findById(req.userId)

      if (!user) {
        return res.status(401).json({
          message: 'User account not found.',
        })
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          message: 'You do not have permission to do this.',
        })
      }

      req.user = user
      next()
    } catch (error) {
      console.error('Role authorization error:', error)

      return res.status(500).json({
        message: 'Failed to verify your permissions.',
      })
    }
  }
}