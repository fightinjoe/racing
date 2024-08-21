'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"

export default function ListPartial() {
  // Force refresh when the racers state changes
  useRaceDayStore(s=>s.racers)
  const raceDay = useRaceDayStore(s=>s.raceDay)()
  
  return (
    <ol className="list-disc ml-6">
      { raceDay.racers().map( (r,i) => <li key={i}>{ r.name }</li> )}
    </ol>
  )
}