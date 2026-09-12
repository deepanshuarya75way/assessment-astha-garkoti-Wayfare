import React from 'react'

const paths = {
  search: 'M21 21l-4.35-4.35m1.35-5.15a7 7 0 11-14 0 7 7 0 0114 0z',
  pin: 'M12 21s-7-6.1-7-11a7 7 0 1114 0c0 4.9-7 11-7 11z M12 13a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  users: 'M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2 M11 3a4 4 0 110 8 4 4 0 010-8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75',
  calendar: 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  heart: 'M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z',
  arrowLeft: 'M19 12H5 M12 19l-7-7 7-7',
  arrowRight: 'M5 12h14 M12 5l7 7-7 7',
  check: 'M20 6L9 17l-5-5',
  card: 'M2 7h20 M2 7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7z M6 15h4',
  bath: 'M4 12h16 M4 12a4 4 0 004 4h8a4 4 0 004-4 M7 12V5a2 2 0 012-2c1 0 1.5.6 1.8 1.2 M4 20h16',
  bed: 'M3 18v-6a2 2 0 012-2h14a2 2 0 012 2v6 M3 18h18 M7 10V6a1 1 0 011-1h3a1 1 0 011 1v4 M13 10V8a1 1 0 011-1h3a1 1 0 011 1v2',
  shield: 'M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z',
  x: 'M18 6L6 18 M6 6l12 12',
  chevronDown: 'M6 9l6 6 6-6',
  ticket: 'M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 000-4V8z',
  menu: 'M3 6h18 M3 12h18 M3 18h18',
  plane: 'M2 22l3-3h6l9-9a2.5 2.5 0 00-3.5-3.5l-9 9v6l-3 3z M15 5l4 4',
  compass: 'M12 22a10 10 0 100-20 10 10 0 000 20z M16 8l-4 4-2 6 4-4 2-6z',
}

export default function Icon({ name, className = 'w-5 h-5', strokeWidth = 1.8 }) {
  const d = paths[name]
  if (!d) return null
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {d.split(' M').map((seg, i) => (
        <path key={i} d={i === 0 ? seg : 'M' + seg} />
      ))}
    </svg>
  )
}
