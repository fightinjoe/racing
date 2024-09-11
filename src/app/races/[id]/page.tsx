'use client'

import { useRaceStore } from "@/stores/raceStore"
import { useRacerStore } from "@/stores/racerStore"

import { Race } from "@/models/race"

import FinishRacerPartial from "./_finishRacer"
import { FinisherTile } from "@/components/tile"
import { Duration, Timer } from "@/components/timer"
import HTML from "@/components/html"

export default function RacePage({params}: {params: {id: string}}) {
  /*== Hooks ==*/

  // The current race to display
  const _race = useRaceStore(s=>s.races).find(r=>r.id===params.id)
  const _racers = useRacerStore(s=>s.racers)
  
  if (!_race) return (<strong>404: Race not found</strong>)

  const race = new Race(_race, _racers)

  function _Banner() {
    return (
      <div>
        {
          race.isFinished
          ? <_Duration />
          : <Timer start={ race!.startTime } />
        }
        
      </div>
    )
  }

  function _Duration() {
    return (
      <div className="flex flex-row gap-2">
        <span>Finished: </span>
        <Duration start={ race.startTime } finish={ race.finishTime! } />
      </div>
    )
  }

  function _StillRacing() {
    return (
      <>
        <h2><strong>Still racing</strong></h2>
        <div className="flex flex-row flex-wrap gap-2">
          { race.unfinishedRacers.map( (r,i) => (
            <FinishRacerPartial key={i} race={_race!} racer={r} />
          )) }
        </div>
      </>
    )
  }

  return (
    <div>
      <header>
        <HTML.back /> Single race { _race.id }
      </header>

      <_Banner />

      { !race.isFinished && <_StillRacing /> }

      <h2><strong>Finshers</strong></h2>
      <div className="flex flex-row flex-wrap gap-2">
        { race.finishers.map( (f,i) => (
          <FinisherTile key={i} position={i} racer={ f } /> 
        )) }
      </div>
    </div>
  )
}