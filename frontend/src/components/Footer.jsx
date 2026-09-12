import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-teal text-parchment mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <span className="font-display italic text-2xl">Wayfare</span>
          <p className="text-parchment/60 text-sm mt-3 leading-relaxed">
            Stays with a story. Booked simply, stamped and confirmed.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-parchment/50 mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-parchment/80">
            <li>Cabins</li>
            <li>Coastal</li>
            <li>Design stays</li>
            <li>Unique architecture</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-parchment/50 mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-parchment/80">
            <li>Help center</li>
            <li>Cancellation options</li>
            <li>Trust &amp; safety</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-parchment/50 mb-3">Hosting</h4>
          <ul className="space-y-2 text-sm text-parchment/80">
            <li>List your place</li>
            <li>Host resources</li>
            <li>Community</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-parchment/10 py-5 text-center text-xs text-parchment/40 font-mono">
        This is a student/demo project — payments are simulated, no real charges occur.
      </div>
    </footer>
  )
}
