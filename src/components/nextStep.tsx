'use client'

import { useRacerStore } from "@/stores/racerStore"

export default function NextStep() {
  const racers = useRacerStore(s=>s.racers)

  const message =
    racers.length === 0 ? <>Register your first <strong>racer</strong> to get started</> :
    racers.length < 5 ?   <><strong>Add 5 racers</strong> to run the first race</> : ''

  if (!message) return

  return (
    <small className="p-4 block bg-yellow-100">
      { message }
    </small>
  )
}