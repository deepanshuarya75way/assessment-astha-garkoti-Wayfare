import React from 'react'
import { Link } from 'react-router-dom'
import ListingCard from '../components/ListingCard.jsx'
import { useFavorites } from '../context/FavoritesContext.jsx'

export default function Favorites() {
  const { favorites } = useFavorites()

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-16">
      <h2 className="font-display text-2xl mb-1">Your saved stays</h2>
      <p className="text-sm text-ink/50 mb-8">
        Stays you've hearted, kept on this device.
      </p>

      {favorites.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-2xl mb-2">No saved stays yet.</p>
          <p className="text-ink/50 mb-6">
            Tap the heart on any listing to save it here.
          </p>
          <Link to="/explore" className="underline text-teal">
            Browse stays
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {favorites.map((listing) => (
            <ListingCard key={listing._id || listing.id} listing={listing} />
          ))}
        </div>
      )}
    </section>
  )
}