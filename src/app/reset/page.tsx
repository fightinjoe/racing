'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"

import HTML from "@/components/html"

export default function ResetPage() {
  const [races, racers, clearRaces, clearRacers, clearConfig] =
    useRaceDayStore( s=>[s.races, s.racers, s.clearRaces, s.clearRacers, s.clearConfig])

  return (
    <div>
      <header className="p-4 row-2">
        <HTML.Back>
          Clear data
        </HTML.Back>
      </header>

      <div className="p-4 grid grid-cols-2 gap-4">
        <HTML.H1>{ races.length } races</HTML.H1>
        <button onClick={ clearRaces } className="ButtonSubmit">Clear all races</button>
      
        <HTML.H1>{ racers.length } racers</HTML.H1>
        <button onClick={ clearRacers } className="ButtonSubmit">Clear all racers</button>
      
        <HTML.H1>Race day</HTML.H1>
        <button onClick={ clearConfig } className="ButtonSubmit">Clear details</button>
      </div>

    </div>
  )
}