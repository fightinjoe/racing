import { useRouter } from "next/navigation"
import { useRaceStore } from "@/stores/raceStore"

import Tile, { NavTile } from "@/components/tile"
import HTML from '@/components/html'
import { printDuration } from "@/lib/printer"
import { Timer } from "./timer"

function StartRacePartial({fleet = 'AB'}: {fleet?:FleetSchema}) {
  const router = useRouter()
  const startRace = useRaceStore(s=>s.startRace)

  const handleClick = () => {
    // create the race
    const race = startRace()

    // redirect to the race
    router.push(`/races/${race.id}`)
  }

  return (
    <Tile
      title="Start race"
      subtitle="Fleet AB"
      onClick={ handleClick }
    />
  )
}

/**
 * Used to show a race IN PROGRESS
 * @param param.race - RaceSchema object to display
 * @returns 
 */
function RunRacePartial({race}:{race:RaceSchema}) {
  return (
    <div>
      <Timer start={ race.startTime } />
      <NavTile 
        title="Ongoing race"
        subtitle={ race.id }
        href={`/races/${ race.id }`}
      />
    </div>
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
      <HTML.h1 title={ `Race ${race.id}` } />
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