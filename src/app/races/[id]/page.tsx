'use client'

import { useRaceStore } from "@/stores/raceStore"
import { useRacerStore } from "@/stores/racerStore"
import FinishRacerPartial from "./_finishRacer"

import { FinisherTile } from "@/components/tile"
import { Timer } from "@/components/timer"
import HTML from "@/components/html"

export default function RacePage({params}: {params: {id: string}}) {
  const race = useRaceStore(s=>s.races).find(r=>r.id===params.id)
  const finisherIds = race?.finishers.map(f=>f.id) || []
  const racers = useRacerStore(s=>s.racers).filter(r=>!finisherIds.includes(r.id))

  if (!race) return (<strong>404: Race not found</strong>)

  function _Banner() {
    return (
      <div>
        <Timer start={ race!.startTime } />
      </div>
    )
  }

  return (
    <div>
      <header>
        <HTML.back /> Single race { race.id }
      </header>

      <_Banner />

      <h2><strong>Still racing</strong></h2>
      <div className="flex flex-row flex-wrap gap-2">
        { racers.map( (r,i) => (
          <FinishRacerPartial key={i} race={race} racer={r} />
        )) }
      </div>

      <h2><strong>Finshers</strong></h2>
      <div className="flex flex-row flex-wrap gap-2">
        { race.finishers.map( (f,i) => (
          <FinisherTile key={i} position={i} racer={ f } /> 
        )) }
      </div>
    </div>
  )
}