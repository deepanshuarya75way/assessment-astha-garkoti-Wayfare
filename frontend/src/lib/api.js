// Central place for every call to the backend.
// Base URL comes from an env var so it can point at localhost in dev
// and at your real server once deployed.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('wayfare_token')

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    // no JSON body (e.g. 204)
  }

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`)
  }

  return data
}

export const api = {
  // Listings
  getListings: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString()
    return request(`/listings${qs ? `?${qs}` : ''}`)
  },
  getListing: (id) => request(`/listings/${id}`),

  // Auth
  signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),

  becomeHost: () =>
  request('/auth/become-host', {
    method: 'POST',
  }),

  // Bookings
  createBooking: (body) => request('/bookings', { method: 'POST', body: JSON.stringify(body) }),
  getMyBookings: () => request('/bookings/mine'),
  getHostBookings: () => request('/bookings/host'),
  getBookingByCode: (code) => request(`/bookings/${code}`),
  cancelBooking: (id) => request(`/bookings/${id}/cancel`, { method: 'PATCH' }),

  // Payments (Razorpay)
  createPaymentOrder: (body) =>
    request('/payments/create-order', { method: 'POST', body: JSON.stringify(body) }),
  verifyPayment: (body) =>
    request('/payments/verify', { method: 'POST', body: JSON.stringify(body) }),
}