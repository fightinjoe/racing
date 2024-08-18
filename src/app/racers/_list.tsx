'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"

export default function ListPartial() {
  const racers = useRaceDayStore(s=>s.racers)
  const findSailor = useRaceDayStore(s=>s.findSailor)
  
  return (
    <ol className="list-disc ml-6">
      { racers.map((r, i) => <li key={i}>{ findSailor(r.sailorId).name }</li> ) }
    </ol>
  )
}