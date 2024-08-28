'use client'

import { useRaceStore } from "@/stores/raceStore"
import RacePartial from "./_race"
import StartRacePartial from "./_startRace"
import { useRacerStore } from "@/stores/racerStore"
import { RaceDay } from "@/models/raceday"

export default function RacesPage() {
  const racers = useRacerStore(s=>s.racers)
  const races = useRaceStore(s=>s.races)

  const raceDay = new RaceDay(racers, races)  

  return (
    <>
      <h1 className="font-bold text-xl">Current Races</h1>
      { raceDay.unfinishedRaces('AB')[0]
        ? <RacePartial race={ raceDay.unfinishedRaces('AB')[0] } />
        : <StartRacePartial fleet="A" />
      }

      <h1 className="font-bold text-xl">Previous races</h1>
      {
        raceDay.finishedRaces('AB').map( race => <RacePartial race={race} /> )
      }
    </>
  )
}