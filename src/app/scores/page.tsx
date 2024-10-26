'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"

import { RaceDay } from "@/models/raceday"

import HTML from "@/components/html"

import styles from "./scoresPage.module.css"

export default function ScoresPage() {
  const [races, racers, config] = useRaceDayStore(s=>[s.races, s.racers, s.config])

  const raceDay = new RaceDay(racers, races, config)

  if( !raceDay.racingFleets ) return (<strong>404: No races found</strong>)

  return (
    <main className="col-0 h-full">
      <HTML.BackHeader title="Scores">
        <a
          className={ styles.emailButton }
          href={`mailto:fightinjoe@gmail.com?subject=Scores&body=${ encodeURI(raceDay.emailScores()) }`}
        >
          Email scores
        </a>
      </HTML.BackHeader>

      <div className="overflow-y-scroll shrink">
        { raceDay.racingFleets.map( (fleet, i) => <FleetScoresPartial {...{fleet, raceDay}} key={i} /> )}
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
      <HTML.H2>Fleet { fleet } scores</HTML.H2>

      <table className="text-white">
        <tr className="text-right bg-ocean-950 text-sm">
          {/* Position + Fleet? + Name header */}

          <th className="font-light text-left py-2">
            <span className={ styles.position }></span>
            { fleet ? '' : <span></span>}
            Name
          </th>

          {/* Total header */}
          <th className="font-light pr-4 text-left">Total</th>

          {/* Races header*/}
          {
            races.map( (race,i) => (
              <th key={i} className={`font-light text-center ${ races.length === i+1 && 'pr-2'}`}>{race}</th>
            ))
          }
        </tr>
      {
        scores.racerScores.map( (s,i) => (
          <tr key={i} className={ i%2 ? 'bg-clear-100' : ''}>
            {/* Position + Name */}
            <th className="py-2 text-left pr-2 font-medium">
              <span className={ styles.position + ' font-mono text-sm'}>{i+1}</span>
              { fleet ? '' : <small className="font-light pr-2">({ s.racer.fleet })</small>}
              {s.racer.name}
            </th>

            {/* Total points */}
            <td className={ styles.points }>{s.points}</td>

            {/* Races */}
            { s.positions.map( (p,i) => (<>
              <td className={`py-2 text-center text-sm font-mono ${s.positions.length === i+1 && 'pr-2'}`}>
                <span className={`inline-block w-[1.25rem] rounded-full ${p.position===1 && 'bg-aqua-400 text-ocean-900'} ${p.position.toString().length > 2 && 'text-red-300'}`}>{p.position}</span>
              </td>
            </>))}
          </tr>
        ))
      }
      </table>
    </div>
  )
}