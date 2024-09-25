'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"

import { RaceDay } from "@/models/raceday"

import HTML from "@/components/html"

export default function ScoresPage() {
  const [races, racers, config] = useRaceDayStore(s=>[s.races, s.racers, s.config])

  const raceDay = new RaceDay(racers, races, config)

  if( !raceDay.racingFleets ) return (<strong>404: No races found</strong>)

  return (
    <main>
      <header className="p-4 row-2">
        <HTML.Back>
          <HTML.H1>Scores</HTML.H1>
        </HTML.Back>
      </header>

      { raceDay.racingFleets.map( (fleet, i) => <FleetScoresPartial {...{fleet, raceDay}} key={i} /> )}

      <div className="col-0 flex-row p-4">
        <a
          className="ButtonSubmit"
          href={`mailto:fightinjoe@gmail.com?subject=Scores&body=${ encodeURI(raceDay.emailScores()) }`}
        >
          Email all scores
        </a>
      </div>
    </main>
  )
}

// Displays the table of scores for a single racing fleet
function FleetScoresPartial({raceDay, fleet}:{raceDay:RaceDay, fleet:FleetSchema | undefined}) {
  const scores = raceDay.scores(fleet)
  
  // Array of sequential R#, starting with R1, to be used as the race column headers
  const races: string[] = scores.racerScores[0].positions.map( (_,i) => `R${i+1}` )

  return (
    <div className="p-4 col-2">
      <HTML.H1>Fleet { fleet } scores</HTML.H1>

      <table>
        <tr className="text-right bg-ocean-800 text-white text-sm">
          {/* Position + Fleet? + Name header */}

          <th className="font-light text-left py-2">
            <span className="w-[2em] inline-block text-right pr-2 font-normal"></span>
            { fleet ? '' : <span></span>}
            Name
          </th>

          {/* Total header */}
          <th className="font-light pr-4">Total</th>

          {/* Races header*/}
          {
            races.map( (race,i) => (
              <th key={i} className={`font-light text-center ${ races.length === i+1 && 'pr-2'}`}>{race}</th>
            ))
          }
        </tr>
      {
        scores.racerScores.map( (s,i) => (
          <tr key={i} className={`${ i%2 ? 'bg-gray-100' : ''}`}>
            {/* Position + Name */}
            <th className="py-2 text-left pr-2">
              <span className="w-[2em] inline-block text-right pr-2 font-normal font-mono text-sm">{i+1}</span>
              { fleet ? '' : <small className="font-light pr-2">({ s.racer.fleet })</small>}
              {s.racer.name}
            </th>

            {/* Total points */}
            <td className="py-2 text-right font-bold font-mono pr-4">{s.points}</td>

            {/* Races */}
            { s.positions.map( (p,i) => (<>
              <td className={`py-2 text-center text-sm font-mono ${s.positions.length === i+1 && 'pr-2'}`}>
                <span className={`inline-block w-[1.25rem] rounded-full ${p.position===1 && 'bg-aqua-400'} ${p.position.toString().length > 2 && 'text-red-600'}`}>{p.position}</span>
              </td>
            </>))}
          </tr>
        ))
      }
      </table>
    </div>
  )
}