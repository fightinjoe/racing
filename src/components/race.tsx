'use client'

import { useRouter } from "next/navigation"
import { useRaceDayStore } from "@/stores/raceDayStore"

import HTML from '@/components/html'
import { printDuration } from "@/lib/printer"
import { Timer } from "@/components/timer"

import styles from "@/components/styles/race.module.css"

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

  return (
    <button
      className={styles.runningRace}
      onClick={ () => router.push(`/races/${race.id}`) }
    >
      <HTML.H1 className={styles.timer}>
        <Timer start={ race.startTime } />
      </HTML.H1>
      <HTML.Small className={ styles.title }>
        <strong>Race { race.id }</strong>
        <span>{ race.course }</span>
      </HTML.Small>
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

const Race = {
  Start: StartRacePartial,
  Running: RunningRacePartial,
  View: ViewRacePartial
}

export default Race