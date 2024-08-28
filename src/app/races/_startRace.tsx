'use client'

import { useRaceStore } from "@/stores/raceStore"
import { useRouter } from "next/navigation"

export default function StartRacePartial({fleet}: {fleet:FleetSchema}) {
  const router = useRouter()
  const startRace = useRaceStore(s=>s.startRace)

  const handleClick = () => {
    // create the race
    const race = startRace()

    // redirect to the race
    router.push(`/races/${race.id}`)
  }

  return (
    <button onClick={handleClick}>Start Race</button>
  )
}