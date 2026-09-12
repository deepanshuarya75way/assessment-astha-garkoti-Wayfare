import React, { useEffect, useMemo, useState } from 'react'
import SearchBar from '../components/SearchBar.jsx'
import ListingCard from '../components/ListingCard.jsx'
import DealCard from '../components/DealCard.jsx'
import { api } from '../lib/api.js'

// These match the tags actually stored in your MongoDB seed data.
const FILTERS = [
  { label: 'All stays', tag: '' },
  { label: 'Beachfront', tag: 'Beachfront' },
  { label: 'Mountain View', tag: 'Mountain View' },
  { label: 'Heritage', tag: 'Heritage' },
  { label: 'Lake View', tag: 'Lake View' },
  { label: 'Backwaters', tag: 'Backwaters' },
]

const DEALS = [
  {
    city: 'Goa',
    subtitle: 'India · beachfront villas',
    dates: 'North Goa',
    price: '₹8,500',
    image: 'https://images.unsplash.com/photo-1582610116397-edb318620f90?q=80&w=600&auto=format&fit=crop',
  },
  {
    city: 'Manali',
    subtitle: 'India · Himalayan cottages',
    dates: 'Himachal Pradesh',
    price: '₹4,200',
    image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?q=80&w=600&auto=format&fit=crop',
  },
  {
    city: 'Jaipur',
    subtitle: 'India · heritage haveli',
    dates: 'Rajasthan',
    price: '₹5,200',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=600&auto=format&fit=crop',
  },
  {
    city: 'Udaipur',
    subtitle: 'India · lake-view stays',
    dates: 'Rajasthan',
    price: '₹6,800',
    image: 'https://images.unsplash.com/photo-1524498250077-390f9e378fc0?q=80&w=600&auto=format&fit=crop',
  },
  {
    city: 'Kerala',
    subtitle: 'India · backwater villas',
    dates: 'Alappuzha',
    price: '₹7,500',
    image: 'https://images.unsplash.com/photo-1596178060810-72f53ce9a65c?q=80&w=600&auto=format&fit=crop',
  },
]

export default function Explore() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All stays')

  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // IMPORTANT: "All stays" must NOT be sent as a tag.
  // The old code sent ?tag=All%20stays, which matches no MongoDB listing.
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    const selectedFilter = FILTERS.find((f) => f.label === activeFilter)
    const tag = selectedFilter?.tag || ''

    api
      .getListings({ query, tag })
      .then((data) => {
        if (!cancelled) setListings(Array.isArray(data?.listings) ? data.listings : [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Could not load listings.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [query, activeFilter])

  const results = useMemo(() => listings, [listings])

  return (
    <div>
      <section className="bg-parchmentDim border-b border-line">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-6">
          <SearchBar
           onSearch={({ destination, location }) => {
           setQuery(destination)
           console.log('Selected location:', location)
          }}
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-10">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl">Popular destinations in India</h2>
            <p className="text-sm text-ink/50 mt-1">
              Real stays loaded from your Wayfare database
            </p>
          </div>
          <span className="text-sm text-ink/40 font-mono hidden sm:block">
            scroll for more →
          </span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
          {DEALS.map((deal) => (
            <DealCard
              key={deal.city}
              {...deal}
              onClick={() => {
                setActiveFilter('All stays')
                setQuery(deal.city)
              }}
            />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-8 pb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8">
          {FILTERS.map((filter) => (
            <button
              key={filter.label}
              onClick={() => {
                setActiveFilter(filter.label)
                if (filter.label !== 'All stays') setQuery('')
              }}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border transition-colors ${
                activeFilter === filter.label
                  ? 'bg-ink text-parchment border-ink'
                  : 'border-line text-ink/60 hover:border-ink/40'
              }`}
            >
              {filter.label}
            </button>
          ))}

          {query && (
            <button
              onClick={() => setQuery('')}
              className="px-4 py-2 rounded-full text-sm whitespace-nowrap border border-coral/40 text-coral"
            >
              Clear "{query}" ✕
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-24 text-ink/50">Loading stays…</div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl mb-2">Couldn't reach the server.</p>
            <p className="text-ink/50">{error}</p>
            <p className="text-ink/40 text-sm mt-2">
              Make sure the backend is running at http://localhost:5000.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl mb-2">No stays match that search.</p>
            <p className="text-ink/50">Try another destination or choose All stays.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {results.map((listing) => (
              <ListingCard key={listing._id || listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
