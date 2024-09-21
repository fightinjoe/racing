'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"

import { RaceDay } from "@/models/raceday"

import HTML from "@/components/html"

export default function ScoresPage() {
  const [races, racers, config] = useRaceDayStore(s=>[s.races, s.racers, s.config])

  const raceDay = new RaceDay(racers, races, config)

  return (
    <main>
      <header className="p-4 row-2">
        <HTML.back />
        <HTML.h1>Scores</HTML.h1>
      </header>

      { raceDay.fleets.map( (fleet, i) => <FleetScoresPartial {...{fleet, raceDay}} key={i} /> )}
    </main>
  )
}

function FleetScoresPartial({raceDay, fleet}:{raceDay:RaceDay, fleet:FleetSchema}) {
  const scores = raceDay.scores(fleet)

  return (
    <div className="p-4 col-2">
      <HTML.h1>Fleet { fleet }</HTML.h1>

      <div className="grid grid-cols-5">
        <div></div>
        <div>Name</div>
        <div>Total</div>
        <div>#1</div>
        <div>#2</div>
      {
        scores.racerScores.map( (s,i) => (<>
          <div>{i+1}</div>
          <div>{s.racer.name}</div>
          <div>{s.points}</div>
          { s.positions.map( (p,i) => (<>
            <div>{p.position}</div>
          </>))}
        </>))
      }
      </div>
    </div>
  )
}