'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"
import { useRouter } from "next/navigation"

export default function StartRacePartial({fleet}: {fleet:FleetSchema}) {
  const router = useRouter()
  const startRace = useRaceDayStore(s=>s.startRace)

  const handleClick = () => {
    // create the race
    const race = startRace('A')

    // redirect to the race
    router.push(`/races/${race.id}`)
  }

  return (
    <button onClick={handleClick}>Start Race</button>
  )
}