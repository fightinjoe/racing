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

  // Array of sequential R#, starting with R1, to be used as the race column headers
  const races: string[] = scores.racerScores[0].positions.map( (_,i) => `R${i+1}` )

  return (
    <div className="p-4 col-2">
      <HTML.h1>Fleet { fleet } scores</HTML.h1>

      <table>
        <tr className="text-right bg-ocean-800 text-white text-sm">
          <th className="font-light text-left py-2">
            <span className="w-[2em] inline-block text-right pr-2 font-normal"></span>
            Name
          </th>
          <th className="font-light pr-4">Total</th>
          {
            races.map( (race,i) => (
              <th className={`font-light ${ races.length === i+1 && 'pr-2'}`}>{race}</th>
            ))
          }
        </tr>
      {
        scores.racerScores.map( (s,i) => (
          <tr className={`${ i%2 ? 'bg-gray-100' : ''}`}>
            <th className="py-2 text-left pr-2">
              <span className="w-[2em] inline-block text-right pr-2 font-normal">{i+1}</span>
              {s.racer.name}
            </th>
            <td className="py-2 text-right font-bold pr-4">{s.points}</td>
            { s.positions.map( (p,i) => (<>
              <td className={`py-2 text-right ${s.positions.length === i+1 && 'pr-2'}`}>{p.position}</td>
            </>))}
          </tr>
        ))
      }
      </table>
    </div>
  )
}