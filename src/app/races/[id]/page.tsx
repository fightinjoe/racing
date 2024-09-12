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

  /*== Local partials ==*/

  function _Banner() {
    return race.isFinished ? <_Duration /> : <_Timer />
  }

  function _Timer() {
    return (
      <div className="row-2 items-center bg-aqua-400 pr-4">

        <strong className="w-[100px] p-4 bg-aqua-300 border border-white border-0 border-r-2">
          <Timer start={ race!.startTime } />
        </strong>

        <small className="flex-auto">2. Windward Leeward</small>

        <button className="bg-white px-2 py-1 rounded">
          <small>Cancel race</small>
        </button>
      </div>
    )
  }

  function _Duration() {
    return (
      <div className="row-2 items-center">
        <strong className="w-[100px] p-4">
          <Duration start={ race.startTime } finish={ race.finishTime! } />
        </strong>
        <small>
          Finished • Course Type
        </small>
      </div>
    )
  }

  function _StillRacing() {
    return (
      <div className="p-4 col-2">
        <h2><strong>Still racing</strong></h2>
        <div className="row-wrap-2">
          { race.unfinishedRacers.map( (r,i) => (
            <FinishRacerPartial key={i} race={_race!} racer={r} />
          )) }
        </div>
      </div>
    )
  }

  function _Finishers() {
    return (
      <div className="p-4 col-2 bg-ocean-200">
        <HTML.h1>Finshers</HTML.h1>
        <div className="row-wrap-2">
          { race.finishers.map( (f,i) => (
            <FinisherTile key={i} position={i} racer={ f } /> 
          )) }
        </div>
      </div>
    )
  }

  return (
    <div>
      <header className="p-4 row-2">
        <HTML.back />
        Single race { _race.id }
      </header>

      <_Banner />

      { race.hasFinishers && <_Finishers /> }

      { !race.isFinished && <_StillRacing /> }
    </div>
  )
}