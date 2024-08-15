'use client'

import { RacersContext } from "@/state/racersContext"
import { useContext } from "react"

export default function ListPartial() {
  const { racersState } = useContext(RacersContext)

  return (
    <ul className="list-disc">
      <li>Racers</li>
      { racersState.map( (r, i) => <li key={i}>{r.sailor.name}</li>)}
    </ul>
  )
}