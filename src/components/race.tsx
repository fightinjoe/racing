'use client'

import { useRouter } from "next/navigation"
import { useRaceStore } from "@/stores/raceStore"

import Tile from "@/components/tile"
import HTML from '@/components/html'
import { printDuration } from "@/lib/printer"
import { Timer } from "./timer"

function StartRacePartial({fleet = 'AB', course, count, disabled}:
  {fleet?:FleetSchema, course?:CourseSchema, count: number, disabled?: boolean}) {
  const router = useRouter()
  const startRace = useRaceStore(s=>s.startRace)

  const handleClick = () => {
    if (disabled) return

    // create the race
    const race = startRace(fleet, course)

    // redirect to the race
    router.push(`/races/${race.id}`)
  }

  return (
    <button
      className="block flex flex-col items-stretch p-4 text-white bg-ocean-400 hover:bg-ocean-500 disabled:bg-gray-200"
      onClick={ handleClick }
      disabled={ disabled }
    >
      <HTML.h1>Begin start sequence</HTML.h1>
      <small>Race {count} - {fleet} fleet</small>
    </button>
  )
}

/**
 * Used to show a race IN PROGRESS
 * @param param.race - RaceSchema object to display
 * @returns 
 */
function RunRacePartial({race}:{race:RaceSchema}) {
  const router = useRouter()

  return (
    <button
      className="block flex flex-col p-4 bg-aqua-400 hover:bg-aqua-500 text-ocean-800"
      onClick={ () => router.push(`/races/${race.id}`) }
    >
      <HTML.h1 className="flex flex-row gap-4">
        <Timer start={ race.startTime } />
        <span>•</span>
        <span>Race { race.id }</span>
      </HTML.h1>
      <HTML.small>{ race.course }</HTML.small>
    </button>
  )
}

/**
 * Used to show FINISHED race
 * @param param.race - RaceSchema object to display
 * @returns 
 */
function ShowRacePartial({race}:{race:RaceSchema}) {
  const first = race.finishers[0]
  const duration = printDuration( race.startTime, first.finishedAt )

  const router = useRouter()

  return (
    <button
      className="block flex flex-col p-4 bg-ocean-100 hover:bg-ocean-200"
      onClick={ () => router.push(`/races/${race.id}`) }
      title={ `Race ${race.id} - 1st: ${first.name} (${duration})` }
    >
      <HTML.h1 className="row-2 items-center w-full text-left">
        <span className="grow">Race {race.id}</span>
        <HTML.small className="font-light">{ duration }</HTML.small>
      </HTML.h1>
      <HTML.small className="text-left truncate w-full text-gray-500 font-light">
        1st: { first.name }
      </HTML.small>
    </button>
  )
}

const Race = {
  start: StartRacePartial,
  run: RunRacePartial,
  show: ShowRacePartial
}

export default Race