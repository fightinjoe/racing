'use client'

import { useRaceStore } from "@/stores/raceStore"
import { useRacerStore } from "@/stores/racerStore"
import FinishRacerPartial from "./_finishRacer"

import Tile from "@/components/tile"

export default function RacePage({params}: {params: {id: string}}) {
  const race = useRaceStore(s=>s.races).find(r=>r.id===params.id)
  const finisherIds = race?.finishers.map(f=>f.id) || []
  const racers = useRacerStore(s=>s.racers).filter(r=>!finisherIds.includes(r.id))

  if (!race) return (<strong>404: Race not found</strong>)

  return (
    <div>
      Single race { race.id }

      <h2><strong>Still racing</strong></h2>
      <ul>
        { racers.map( (r,i) => (
          <FinishRacerPartial key={i} race={race} racer={r} />
        )) }
      </ul>

      <h2><strong>Finshers</strong></h2>
      <div>
        { race.finishers.map( (f,i) => (
          <Tile key={i} title={ f.name } subtitle="" /> 
        )) }
      </div>
    </div>
  )
}