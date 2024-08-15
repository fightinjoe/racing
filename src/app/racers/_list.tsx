'use client'

import { useContext } from "react"
import { useRacersStore } from "@/stores/racersStore"

export default function ListPartial() {
  const racers = useRacersStore(s=>s.racers)

  return (
    <ol className="list-disc ml-6">
      { racers.map( (r, i) => <li key={i}>{r.sailor.name}</li>)}
    </ol>
  )
}