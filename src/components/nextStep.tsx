'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"

import { RaceDay } from "@/models/raceday"

export default function NextStep() {
  const [racers, config] = useRaceDayStore(s=>[s.racers, s.config])
  const raceDay = new RaceDay(racers,[],config)

  const message =
    racers.length === 0                                      ? <>Register your first <strong>racer</strong> to get started</> :
    config.raceSeparateFleets && !raceDay.hasEnoughRacers()  ? <><strong>Add 5 racers</strong> to each fleet to run the first race</> :
    !config.raceSeparateFleets && !raceDay.hasEnoughRacers() ? <><strong>Add 5 racers</strong> to run the first race</> :
    !config.hasSaved                                         ? <>Set the <strong>race details</strong> to start racing</> : ''

  if (!message) return

  return (
    <small className="p-4 block bg-yellow-100">
      { message }
    </small>
  )
}