'use client'

import Link from 'next/link'
import { useRacersStore } from '@/stores/racersStore'

export default function NavigationPartial() {
  const isReadyToRace = useRacersStore(s=>s.isReadyToRace)

  return (
    <nav>
      <Link href="/racers">Racers</Link>
      { isReadyToRace && <Link href="/races">Races</Link> }
    </nav>
  )
}