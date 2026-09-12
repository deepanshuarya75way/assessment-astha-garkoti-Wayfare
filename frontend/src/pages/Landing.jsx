import React from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden">
      {/* full-bleed vacation photo */}
      <img
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop"
        alt="A quiet turquoise bay lined with cliffs at golden hour"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-ink/10" />
      <div className="absolute inset-0 opacity-10 bg-grain" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 w-full">
        <p className="font-mono text-marigold text-xs tracking-[0.3em] uppercase mb-4">
          Wayfare · stays worth the trip
        </p>
        <h1 className="font-display text-parchment text-5xl md:text-7xl leading-[1.03] max-w-2xl">
          Wherever you're going, <span className="italic text-marigold">go properly.</span>
        </h1>
        <p className="text-parchment/80 max-w-md mt-5 text-lg">
          Cabins, courtyards, silos and rooftops around the world — browse real
          places, book in minutes, and get a boarding pass for your stay.
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-9">
          <button
            onClick={() => navigate('/explore')}
            className="flex items-center gap-2 bg-coral text-parchment px-7 py-4 rounded-full font-medium hover:bg-coral/90 transition-colors text-base"
          >
            <Icon name="compass" className="w-5 h-5" />
            Start exploring
          </button>
          <span className="text-parchment/60 text-sm font-mono">
            250+ stays · 40 countries
          </span>
        </div>
      </div>
    </div>
  )
}
