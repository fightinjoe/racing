'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"
import { useRosterStore } from "@/stores/rosterStore"
import { RACERS } from "@/schemas/CONFIG"

import Button from "@/components/button"

import HTML from "@/components/html"

export default function ResetPage() {
  const [races, racers, volunteers, addRacer, clearRaces, clearRacers, clearVolunteers, clearConfig] =
    useRaceDayStore( s=>[s.races, s.racers, s.volunteers, s.addRacer, s.clearRaces, s.clearRacers, s.clearVolunteers, s.clearConfig])

  const [roster, printTimestamp, clearRoster, fetchRoster] =
    useRosterStore(s => [s.roster, s.printTimestamp, s.clearRoster, s.fetchRoster])

  const loadRacers = () => {
    const names = racers.map( r=>r.name )

    RACERS
      .filter( r => !names.includes(r.name) )
      .forEach( r => { addRacer( r.name, r.sailNumber, r.fleet ) })
  }

  const handleLoadRoster = (e:React.MouseEvent<HTMLButtonElement>) => {
    const elt = e.currentTarget

    elt.classList.add('animate-pulse')
    fetchRoster( () => elt.classList.remove('animate-pulse') )
  }

  return (
    <div>
      <HTML.BackHeader title="Manage data" />

      <section className="m-2 p-2 rounded-lg  grid grid-cols-2 gap-4 items-center bg-white">
        <HTML.H1 className="text-center !text-black">{ races.length } races</HTML.H1>
        <Button.Primary onClick={ clearRaces }>Clear races</Button.Primary>
      
        <HTML.H1 className="text-center !text-black">{ racers.length } racers</HTML.H1>
        {
          racers.length === 0
            ? <Button.Primary onClick={ loadRacers }>Load racers</Button.Primary>
            : <Button.Primary onClick={ clearRacers }>Clear racers</Button.Primary>
        }

        <HTML.H1 className="text-center !text-black">{ volunteers.length } volunteers</HTML.H1>
        <Button.Primary onClick={ clearVolunteers }>Clear volunteers</Button.Primary>
      
        <HTML.H1 className="text-center !text-black">Race day</HTML.H1>
        <Button.Primary onClick={ clearConfig }>Clear details</Button.Primary>

        <hr /><hr />

        <div>
          <HTML.H1 className="text-center !text-black">{ roster.length } members</HTML.H1>
          <small>{ printTimestamp() }</small>
        </div>
        <Button.Primary onClick={ handleLoadRoster }>Load roster</Button.Primary>
        <br />
        <Button.Primary onClick={ clearRoster }>Clear roster</Button.Primary>
      </section>

    </div>
  )
}