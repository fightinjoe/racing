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

function CreateRacePartial({fleet, course, disabled}:
  {fleet?:FleetSchema, course:CourseSchema, disabled?: boolean}) {
  const router = useRouter()
  const createRace = useRaceDayStore(s=>s.createRace)

  const handleClick = () => {
    if (disabled) return

    // create the race
    const race = createRace(course, fleet)

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

function ViewRacePartial(props:{race:RaceSchema}) {
  const racers = useRaceDayStore(s => s.racers)
  const race = new Race(props.race, racers)
  const raceState = race.raceState

  return (
    raceState === 'before-start' ? NotStartedRacePartial(race) :
    raceState === 'finished' ? FinishedRacePartial(race) :
    RunningRacePartial(race)
  )
}

function NotStartedRacePartial(race:Race) {
  const router = useRouter()

  return (
    <button
      className=""
      onClick={ () => router.push(`/races/${race.id}`) }
    >
      <HTML.H1 className={styles.timer}>
        ???
      </HTML.H1>
      <div className={ styles.title }>
        <HTML.H1>Race { race.id }</HTML.H1>
        <HTML.Small className="truncate">{ race.course }</HTML.Small>
      </div>
    </button>
  )
}

/**
 * Component that shows a race IN PROGRESS
 * @param param.race - RaceSchema object to display
 * @returns 
 */
function RunningRacePartial(race:Race) {
  const router = useRouter()
  const { raceState } = useRaceState(race)

  let classNames = [styles.runningRace]
  raceState === 'countdown' && classNames.push(styles.before)

  return (
    <button
      className={ classNames.join(' ')}
      onClick={ () => router.push(`/races/${race.id}`) }
    >
      <HTML.H1 className={styles.timer}>
        <Timer start={ race.startTime! } />
      </HTML.H1>
      <div className={ styles.title }>
        <HTML.H1>Race { race.id }</HTML.H1>
        <HTML.Small className="truncate">{ race.course }</HTML.Small>
      </div>
    </button>
  )
}

/**
 * Component that shows a FINISHED race
 * @param param.race - RaceSchema object to display
 * @returns 
 */
function FinishedRacePartial(race:Race) {
  const first = race.finishers[0]
  const duration = printDuration( race.startTime!, first.finishedAt )

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

function NewRace({fleet, raceDay}: NewRaceProps) {
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
  Create: CreateRacePartial,
  View: ViewRacePartial,
  New: NewRace
}

export default RaceFCs