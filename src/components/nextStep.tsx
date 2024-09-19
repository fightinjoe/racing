'use client'

import { useDetailsStore } from "@/stores/detailsStore"
import { useRacerStore } from "@/stores/racerStore"

import { RaceDay } from "@/models/raceday"

export default function NextStep() {
  const racers = useRacerStore(s=>s.racers)
  const config = useDetailsStore(s=>s.config)
  const raceDay = new RaceDay(racers,[],config)

  const message =
    racers.length === 0                             ? <>Register your first <strong>racer</strong> to get started</> :
    config.raceSeparateFleets && !raceDay.canRace() ? <><strong>Add 5 racers</strong> to each fleet to run the first race</> :
    !raceDay.canRace()                              ?   <><strong>Add 5 racers</strong> to run the first race</> : ''

  if (!message) return

  return (
    <small className="p-4 block bg-yellow-100">
      { message }
    </small>
  )
}