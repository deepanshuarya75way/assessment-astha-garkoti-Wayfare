import React from 'react'
import { Link } from 'react-router-dom'
import { useBooking } from '../context/BookingContext.jsx'
import Icon from './Icon.jsx'

export default function Sidebar({ open, onClose }) {
  const { user } = useBooking()

  const links = [
    { label: 'Explore stays', to: '/explore' },
    { label: 'Become a host', to: '/host/apply' },
    { label: 'Trips', to: '/trips' },
  ]

  if (user?.role === 'host' || user?.role === 'admin') {
    links.push({ label: 'Manage bookings', to: '/host/bookings' })
    links.push({ label: 'Add a property', to: '/admin/listings/new' })
  }

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-[300px] bg-parchment z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 h-20 border-b border-line">
          <Link to="/" onClick={onClose} className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-marigold font-display italic text-lg">
              w
            </span>
            <span className="font-display italic text-2xl">Wayfare</span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-parchmentDim transition-colors"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {user && (
          <div className="px-6 py-5 border-b border-line flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal text-marigold flex items-center justify-center font-display italic">
              {user.name[0]}
            </div>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-ink/50">{user.email}</p>
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 py-4">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={onClose}
              className="flex items-center justify-between px-3 py-3 rounded-xl text-sm text-ink/80 hover:bg-parchmentDim transition-colors"
            >
              {link.label}
              <Icon name="arrowRight" className="w-4 h-4 text-ink/30" />
            </Link>
          ))}
        </nav>

        <div className="px-6 py-6 border-t border-line">
          {!user ? (
            <div className="flex gap-2">
              <Link
                to="/login"
                onClick={onClose}
                className="flex-1 text-center text-sm px-4 py-2.5 rounded-full border border-line hover:border-ink/40 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={onClose}
                className="flex-1 text-center text-sm px-4 py-2.5 rounded-full bg-teal text-parchment hover:bg-teal-light transition-colors"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <p className="text-xs text-ink/40 font-mono">Wayfare · demo build</p>
          )}
        </div>
      </aside>
    </>
  )
}