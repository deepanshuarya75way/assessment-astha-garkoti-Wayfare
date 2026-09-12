import React from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { useFavorites } from '../context/FavoritesContext.jsx'

export default function ListingCard({ listing }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const listingId = listing._id || listing.id // MongoDB gives _id, static demo data used id
  const saved = isFavorite(listingId)

  return (
    <div className="group animate-rise">
      <div className="relative rounded-2xl overflow-hidden shadow-ticket">
        <Link to={`/listing/${listingId}`}>
          <img
            src={listing.images?.[0] || 'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop'}
            alt={listing.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleFavorite(listing)
          }}
          aria-label="Save listing"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-ink/30 backdrop-blur flex items-center justify-center"
        >
          <Icon
            name="heart"
            className={`w-4 h-4 ${saved ? 'text-coral fill-coral' : 'text-parchment'}`}
          />
        </button>
        {listing.tags?.[0] && (
          <span className="absolute top-3 left-3 bg-parchment/90 text-ink text-[11px] uppercase tracking-widest px-3 py-1 rounded-full font-mono">
            {listing.tags[0]}
          </span>
        )}
      </div>

      {/* ticket stub body with perforation */}
      <div
        className="relative bg-parchment border border-t-0 border-line rounded-b-2xl -mt-1 pt-4 pb-4 px-5 ticket-notch"
        style={{ '--notch-top': '0%' }}
      >
        <div className="dashed-divider absolute -top-px left-4 right-4" />
        <Link to={`/listing/${listingId}`} className="block">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg leading-snug pr-2">{listing.title}</h3>
            <span className="flex items-center gap-1 text-xs font-mono shrink-0 mt-1">
              <Icon name="star" className="w-3.5 h-3.5 text-marigold fill-marigold" />
              {listing.rating}
            </span>
          </div>
          <p className="text-ink/60 text-sm mt-1">{listing.location}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="font-mono text-[11px] text-ink/40 tracking-widest">
              #{listing.code}
            </span>
            <span className="font-display text-lg">
              ₹{listing.price}
              <span className="text-xs text-ink/50 font-body"> / night</span>
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}