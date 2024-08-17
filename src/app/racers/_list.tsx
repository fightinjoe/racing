'use client'

import { useRacerStore } from "@/stores/racerStore"

export default function ListPartial() {
  const racers = useRacerStore(s=>s.racers)
  
  return (
    <ol className="list-disc ml-6">
      { racers.map( (r, i) => <li key={i}>{r.name}</li>)}
    </ol>
  )
}