import { NavTile } from "@/components/tile"

function StartRacePartial({fleet = 'AB'}: {fleet?:FleetSchema}) {
  return (
    <button>
      New race for fleet {fleet}
    </button>
  )
}

function RunRacePartial({race}:{race:RaceSchema}) {
  return (
    <NavTile 
      title="Ongoing race"
      subtitle={ race.id }
      href={`/races/${ race.id }`}
    />
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