'use client'

import { useContext } from "react"
import { useRacerStore } from "@/stores/racerStore"

export default function ListPartial() {
  const racers = useRacerStore(s=>s.racers)

  return (
    <ol className="list-disc ml-6">
      { racers.map( (r, i) => <li key={i}>{r.sailor.name}</li>)}
    </ol>
  )
}