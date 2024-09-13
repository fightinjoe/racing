'use client'

import { useRaceStore } from "@/stores/raceStore"
import { useRacerStore } from "@/stores/racerStore"

import HTML from "@/components/html"

export default function ResetPage() {
  const [races,  clearRaces]  = useRaceStore( s=>[s.races,  s.clearRaces])
  const [racers, clearRacers] = useRacerStore(s=>[s.racers, s.clearRacers])

  return (
    <div>
      <header className="p-4 row-2">
        <HTML.back />
        Clear data
      </header>

      <div className="p-4 col-2">
        <div>
          <HTML.h1>{ races.length } races</HTML.h1>
          <button onClick={ clearRaces }>Clear all races</button>
        </div>

        <div>
          <HTML.h1>{ racers.length } racers</HTML.h1>
          <button onClick={ clearRacers }>Clear all racers</button>
        </div>
      </div>

    </div>
  )
}