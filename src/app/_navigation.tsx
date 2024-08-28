'use client'

import Link from 'next/link'

export default function NavigationPartial() {
  const isReadyToRace = true // useRaceDayStore(s=>s.isReadyToRace)

  return (
    <nav className="flex flex-row gap-2">
      <Link href="/">Home</Link>
      <Link href="/racers">Racers</Link>
      { isReadyToRace && <Link href="/races">Races</Link> }
    </nav>
  )
}