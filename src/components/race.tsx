'use client'

import { useRouter } from "next/navigation"
import { useRaceStore } from "@/stores/raceStore"

import Tile from "@/components/tile"
import HTML from '@/components/html'
import { printDuration } from "@/lib/printer"
import { Timer } from "./timer"

function StartRacePartial({fleet = 'AB', count}: {fleet?:FleetSchema, count: number}) {
  const router = useRouter()
  const startRace = useRaceStore(s=>s.startRace)

  const handleClick = () => {
    // create the race
    const race = startRace(fleet)

    // redirect to the race
    router.push(`/races/${race.id}`)
  }

  return (
    <button
      className="block flex flex-col items-stretch p-4 text-white bg-ocean-400 hover:bg-ocean-500"
      onClick={ handleClick }
    >
      <HTML.h1>New { fleet } race</HTML.h1>
      <HTML.small>Start race #{ count }</HTML.small>
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
      <HTML.small>Course name</HTML.small>
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
    >
      <HTML.h1>Race {race.id}</HTML.h1>
      <HTML.small>1st: { first.name } @ { duration }</HTML.small>
    </button>
  )
}

const Race = {
  start: StartRacePartial,
  run: RunRacePartial,
  show: ShowRacePartial
}

export default Race