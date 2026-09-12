import React from 'react'

export default function DealCard({ image, city, subtitle, dates, price, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-2xl overflow-hidden bg-parchment border border-line shadow-ticket hover:-translate-y-1 transition-transform duration-300 shrink-0 w-64"
    >
      <img src={image} alt={city} className="w-full h-36 object-cover" />
      <div className="p-4">
        <h4 className="font-display text-lg">{city}</h4>
        {subtitle && <p className="text-xs text-ink/50 mt-0.5">{subtitle}</p>}
        {dates && <p className="text-xs text-ink/40 mt-1 font-mono">{dates}</p>}
        <p className="text-sm mt-2">
          <span className="text-ink/50">from </span>
          <span className="font-display text-lg text-teal">{price}</span>
        </p>
      </div>
    </button>
  )
}
