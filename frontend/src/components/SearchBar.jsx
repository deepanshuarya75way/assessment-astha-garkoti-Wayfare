import React, { useEffect, useState } from 'react'
import Icon from './Icon.jsx'

export default function SearchBar({ onSearch }) {
  const [destination, setDestination] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [loadingPlaces, setLoadingPlaces] = useState(false)

  // Search OpenStreetMap when the user types a destination
  useEffect(() => {
    if (!destination.trim()) {
      setSuggestions([])
      return
    }

    // Wait 500ms after the user stops typing
    const timer = setTimeout(async () => {
      try {
        setLoadingPlaces(true)

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
            destination
          )}&limit=5&addressdetails=1`,
          {
            headers: {
              Accept: 'application/json',
            },
          }
        )

        if (!response.ok) {
          throw new Error('Location search failed')
        }

        const data = await response.json()
        setSuggestions(data)
      } catch (error) {
        console.error('Location search error:', error)
        setSuggestions([])
      } finally {
        setLoadingPlaces(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [destination])

  // When user clicks a suggestion
  function selectPlace(place) {
    const selectedLocation = {
      name: place.display_name,
      latitude: Number(place.lat),
      longitude: Number(place.lon),
      placeId: place.place_id,
    }

    console.log('Selected location:', selectedLocation)

    // Show selected location in input
    setDestination(place.display_name)

    // Hide suggestions
    setSuggestions([])

    // Send the location to Explore.jsx
    onSearch?.({
      destination: place.display_name,
      location: selectedLocation,
      checkIn,
      checkOut,
      guests,
    })
  }

  function submit(e) {
    e.preventDefault()

    onSearch?.({
      destination,
      checkIn,
      checkOut,
      guests,
    })

    setSuggestions([])
  }

  return (
    <form
      onSubmit={submit}
      className="bg-parchment rounded-full shadow-ticket border border-line flex flex-col md:flex-row items-stretch md:items-center divide-y md:divide-y-0 md:divide-x divide-line overflow-visible"
    >
      {/* WHERE */}
      <label className="flex-1 flex items-center gap-3 px-6 py-4 md:py-3 relative">
        <Icon name="pin" className="w-4 h-4 text-teal shrink-0" />

        <div className="flex flex-col text-left w-full">
          <span className="text-[11px] uppercase tracking-widest text-ink/40">
            Where
          </span>

          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Search destinations"
            className="bg-transparent outline-none text-sm placeholder:text-ink/30 w-full"
          />

          {/* LOCATION SUGGESTIONS */}
          {(suggestions.length > 0 || loadingPlaces) && (
            <div className="absolute left-4 right-4 md:left-6 md:right-6 top-full mt-3 z-50 bg-parchment border border-line rounded-2xl shadow-lg overflow-hidden">
              {loadingPlaces ? (
                <div className="px-4 py-4 text-sm text-ink/50">
                  Searching locations...
                </div>
              ) : (
                suggestions.map((place) => (
                  <button
                    key={place.place_id}
                    type="button"
                    onClick={() => selectPlace(place)}
                    className="w-full text-left px-4 py-3 hover:bg-parchmentDim transition-colors border-b border-line last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <Icon
                        name="pin"
                        className="w-4 h-4 text-teal mt-1 shrink-0"
                      />

                      <div>
                        <p className="text-sm font-medium">
                          {place.display_name.split(',')[0]}
                        </p>

                        <p className="text-xs text-ink/50 mt-1">
                          {place.display_name}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </label>

      {/* CHECK IN */}
      <label className="flex-1 flex items-center gap-3 px-6 py-4 md:py-3">
        <Icon name="calendar" className="w-4 h-4 text-teal shrink-0" />

        <div className="flex flex-col text-left w-full">
          <span className="text-[11px] uppercase tracking-widest text-ink/40">
            Check in
          </span>

          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>
      </label>

      {/* CHECK OUT */}
      <label className="flex-1 flex items-center gap-3 px-6 py-4 md:py-3">
        <Icon name="calendar" className="w-4 h-4 text-teal shrink-0" />

        <div className="flex flex-col text-left w-full">
          <span className="text-[11px] uppercase tracking-widest text-ink/40">
            Check out
          </span>

          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>
      </label>

      {/* GUESTS */}
      <label className="flex-1 flex items-center gap-3 px-6 py-4 md:py-3">
        <Icon name="users" className="w-4 h-4 text-teal shrink-0" />

        <div className="flex flex-col text-left w-full">
          <span className="text-[11px] uppercase tracking-widest text-ink/40">
            Guests
          </span>

          <input
            type="number"
            min={1}
            max={16}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>
      </label>

      {/* SEARCH BUTTON */}
      <div className="p-2 md:pr-2 flex items-center justify-center">
        <button
          type="submit"
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-coral text-parchment px-6 py-3 rounded-full text-sm font-medium hover:bg-coral/90 transition-colors"
        >
          <Icon name="search" className="w-4 h-4" />
          Search
        </button>
      </div>
    </form>
  )
}

