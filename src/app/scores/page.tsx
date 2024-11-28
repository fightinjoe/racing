'use client'

import { useRef } from "react"
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
        <ExportLink />
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
        <thead>
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
        </thead>
        <tbody>
        {
          scores.racerScores.map( (s,i) => (
            <tr key={`racer_${i}`} className={ i%2 ? 'bg-clear-100' : ''}>
              {/* Position + Name */}
              <th className="py-2 text-left pr-2 font-medium">
                <span className={ styles.position + ' font-mono text-sm'}>{i+1}</span>
                { fleet ? '' : <small className="font-light pr-2">({ s.racer.fleet })</small>}
                {s.racer.name}
              </th>

              {/* Total points */}
              <td className={ styles.points }>{s.points}</td>

              {/* Races */}
              { s.positions.map( (p,j) => (
                <td key={`position_${i}_${j}`} className={`py-2 text-center text-sm font-mono ${s.positions.length === j+1 && 'pr-2'}`}>
                  <span className={`inline-block w-[1.25rem] rounded-full ${p.position===1 && 'bg-aqua-400 text-ocean-900'} ${p.position.toString().length > 2 && 'text-red-300'}`}>{p.position}</span>
                </td>
              ))}
            </tr>
          ))
        }
        </tbody>
      </table>
    </div>
  )
}

function ExportLink() {
  const tableRef = useRef<HTMLTableElement>(null)

  const [races, racers, config] = useRaceDayStore(s=>[s.races, s.racers, s.config])

  const raceDay = new RaceDay(racers, races, config)

  const racingFleets = raceDay.racingFleets || [undefined]
  const scores = racingFleets.map( fleet => raceDay.scores(fleet) )

  // Find the maximum number of races raced for the day across all fleets
  const raceCount = scores.reduce(
    (acc, score) => Math.max(acc, score.racerScores[0].positions.length),
    0
  )

  const copyTableToClipboard = () => {
    const tableHtml = tableRef.current?.outerHTML;

    if (tableHtml) {
      const blob = new Blob([tableHtml], { type: 'text/html' })
      const data = [new ClipboardItem({ 'text/html': blob })]

      navigator.clipboard.write(data).then(() => {
        alert('Table copied to clipboard. Please paste it into the email body.')
      }).catch(err => {
        console.error('Failed to copy: ', err)
        fallbackCopyTextToClipboard(tableHtml)
      })
    }
  }

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      alert('Table copied to clipboard. Please paste it into the email body.')
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err)
    }
    document.body.removeChild(textArea)
  }

  return (
    <>
      <a
        className={ styles.emailButton }
        href={`mailto:fightinjoe@gmail.com?subject=Scores&body=Scores are copied in your clipboard. Tap to paste scores here.`}
        onClick={ copyTableToClipboard}
      >
        Email scores
      </a>
        
      <table className="hidden" ref={ tableRef }>
        <thead>
          <tr>
            <td>date</td>
            <td>race_fleet</td>
            <td>is_rc</td>
            <td>name</td>
            <td>sail_number</td>
            <td>start_fleet</td>
            {
              Array.from({length:raceCount}, 
                (_, i) => <td key={i}>finishes_{i+1}</td>
              )
            }
          </tr>
        </thead>
        <tbody>
          {
            scores.map( ({fleet, racerScores}) => (
              racerScores.map( ({racer, positions}) => (
                <tr key={racer.id}>
                  <td>{ new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }</td>
                  <td>{ fleet || 'AB' }</td>
                  <td></td>
                  <td>{ racer.name }</td>
                  <td>{ racer.sailNumber }</td>
                  <td>{ racer.fleet }</td>
                  {
                    positions.map( ({position, failure}) => (
                      <td key={position}>{ failure ? failure : position }</td>
                    ))
                  }
                </tr>
              ))
            ))
          }
        </tbody>
      </table>
    </>
  )
}