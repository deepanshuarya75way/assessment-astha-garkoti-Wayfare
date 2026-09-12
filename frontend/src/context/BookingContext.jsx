import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api.js'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [trip, setTrip] = useState({
    listingId: null,
    checkIn: '',
    checkOut: '',
    guests: 1,
  })
  const [user, setUser] = useState(null) // { id, name, email, role }
  const [authLoading, setAuthLoading] = useState(true)
  const [orders, setOrders] = useState([])

  // On page load/refresh, check the stored token against the backend
  // so role-based access survives a refresh instead of resetting.
  useEffect(() => {
    const token = localStorage.getItem('wayfare_token')

    if (!token) {
      setAuthLoading(false)
      return
    }

    api
      .me()
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('wayfare_token')
        setUser(null)
      })
      .finally(() => setAuthLoading(false))
  }, [])

  function startTrip(listingId, patch = {}) {
    setTrip((t) => ({ ...t, listingId, ...patch }))
  }

  function updateTrip(patch) {
    setTrip((t) => ({ ...t, ...patch }))
  }

  // Takes the full user object the backend returns (id, name, email, role)
  function login(userData) {
    setUser(userData)
  }

  function logout() {
    localStorage.removeItem('wayfare_token')
    setUser(null)
  }

  function confirmOrder(order) {
    setOrders((o) => [order, ...o])
  }

  return (
    <BookingContext.Provider
      value={{
        trip,
        startTrip,
        updateTrip,
        user,
        authLoading,
        login,
        logout,
        orders,
        confirmOrder,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}