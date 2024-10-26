'use client'

import { useRouter } from "next/navigation"
import { useRaceDayStore } from "@/stores/raceDayStore"

import HTML from '@/components/html'
import { printDuration } from "@/lib/printer"
import { Timer } from "@/components/timer"
import useModalTray from "@/components/useModalTray"
import CourseChooser from "@/components/courseChooser"

import { RaceDay } from "@/models/raceday"
import { Race } from "@/models/race"

import styles from "@/components/styles/race.module.css"
import { useRaceState } from "./useRaceState"

export function StartRacePartial({fleet, course, count, disabled}:
  {fleet?:FleetSchema, course:CourseSchema, count: number, disabled?: boolean}) {
  const router = useRouter()
  const startRace = useRaceDayStore(s=>s.startRace)

  const handleClick = () => {
    if (disabled) return

    // create the race
    const race = startRace(course, fleet)

    // redirect to the race
    router.push(`/races/${race.id}`)
  }

  return (
    <button
      className={ styles.startRace }
      onClick={ handleClick }
      disabled={ disabled }
    >
      Select course
    </button>
  )
}

/**
 * Used to show a race IN PROGRESS
 * @param param.race - RaceSchema object to display
 * @returns 
 */
export function RunningRacePartial({race}:{race:RaceSchema}) {
  const router = useRouter()
  const { raceState } = useRaceState(new Race(race))

  let classNames = [styles.runningRace]
  raceState === 'before-start' && classNames.push(styles.before)

  return (
    <button
      className={ classNames.join(' ')}
      onClick={ () => router.push(`/races/${race.id}`) }
    >
      <HTML.H1 className={styles.timer}>
        <Timer start={ race.startTime } />
      </HTML.H1>
      <div className={ styles.title }>
        <strong>Race { race.id }</strong>
        <HTML.Small className="truncate">{ race.course }</HTML.Small>
      </div>
    </button>
  )
}

/**
 * Used to show FINISHED race
 * @param param.race - RaceSchema object to display
 * @returns 
 */
export function ViewRacePartial({race}:{race:RaceSchema}) {
  const first = race.finishers[0]
  const duration = printDuration( race.startTime, first.finishedAt )

  const router = useRouter()

  return (
    <button
      className={ styles.viewRace }
      onClick={ () => router.push(`/races/${race.id}`) }
      title={ `Race ${race.id} - 1st: ${first.name} (${duration})` }
    >
      <HTML.H1 className={ styles.title }>
        <span className="grow">Race {race.id}</span>
        <HTML.Small className="font-light">{ duration }</HTML.Small>
      </HTML.H1>
      <HTML.Small className={ styles.subtitle }>
        1st: { first.name }
      </HTML.Small>
    </button>
  )
}

interface NewRaceProps {
  fleet: FleetSchema|undefined
  raceDay: RaceDay
}

export function NewRace({fleet, raceDay}: NewRaceProps) {
  const nextRaceCount = raceDay.races(fleet).length + 1

  const courseModal = useModalTray({})

  return(
    <>
      <button
        className={ styles.startRace }
        onClick={ () => courseModal.props.show() }
      >
        <HTML.H1>Start race  { `${nextRaceCount}${fleet || ''}` }</HTML.H1>
        <HTML.Small>{fleet || 'Combined'} fleet</HTML.Small>
      </button>

      <courseModal.Tray {...courseModal.props} className="max-w-[390px] flex flex-row items-center">
        <CourseChooser fleet={fleet} count={nextRaceCount} onCancel={ courseModal.props.hide } />
      </courseModal.Tray>
    </>
  )
}

const RaceFCs = {
  Start: StartRacePartial,
  Running: RunningRacePartial,
  View: ViewRacePartial,
  New: NewRace
}

export default RaceFCs