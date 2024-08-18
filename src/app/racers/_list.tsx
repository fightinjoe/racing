'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"

export default function ListPartial() {
  const racers = useRaceDayStore(s=>s.racers)
  const findSailor = useRaceDayStore(s=>s.findSailor)
  
  return (
    <ol className="list-disc ml-6">
      { Array.from(racers.entries()).map(([id, r], i) => <li key={id}>{ findSailor(id).name }</li> ) }
    </ol>
  )
}