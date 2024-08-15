'use client'

import Link from 'next/link'
import { useRacerStore } from '@/stores/racerStore'

export default function NavigationPartial() {
  const isReadyToRace = useRacerStore(s=>s.isReadyToRace)

  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/racers">Racers</Link>
      { isReadyToRace && <Link href="/races">Races</Link> }
    </nav>
  )
}