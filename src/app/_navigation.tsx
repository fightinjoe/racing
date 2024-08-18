'use client'

import Link from 'next/link'
import { useRaceDayStore } from '@/stores/raceDayStore'

export default function NavigationPartial() {
  const isReadyToRace = true // useRaceDayStore(s=>s.isReadyToRace)

  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/racers">Racers</Link>
      { isReadyToRace && <Link href="/races">Races</Link> }
    </nav>
  )
}