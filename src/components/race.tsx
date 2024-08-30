import { useRouter } from "next/navigation"
import { useRaceStore } from "@/stores/raceStore"

import Tile, { NavTile } from "@/components/tile"
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

function ShowRacePartial({race}:{race:RaceSchema}) {
  return (
    <NavTile 
      title="Finished race"
      subtitle={ race.id }
      href={`/races/${ race.id }`}
    />
  )
}

const Race = {
  start: StartRacePartial,
  run: RunRacePartial,
  show: ShowRacePartial
}

export default Race