'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"
import RacePartial from "./_race"
import StartRacePartial from "./_startRace"

export default function RacesPage() {
  const getCurrentRace = useRaceDayStore(s=>s.getCurrentRace)

  const currentRace = getCurrentRace('A')
  const races = useRaceDayStore(s=>s.races)

  return (
    <>
      <h1 className="font-bold text-xl">Current Races</h1>
      { currentRace
        ? <RacePartial race={currentRace!} />
        : <StartRacePartial fleet="A" />
      }

      <h1 className="font-bold text-xl">Previous races</h1>
      {
        races.map( race => <RacePartial race={race} /> )
      }
    </>
  )
}