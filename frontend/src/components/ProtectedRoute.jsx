import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useBooking } from '../context/BookingContext.jsx'

// roles: optional array, e.g. ['host', 'admin']. Omit to just require login.
export default function ProtectedRoute({ children, roles }) {
  const { user, authLoading } = useBooking()
  const location = useLocation()

  if (authLoading) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/host/apply" replace />
  }

  return children
}