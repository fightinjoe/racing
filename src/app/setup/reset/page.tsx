'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"
import { RACERS } from "@/schemas/CONFIG"

import Button from "@/components/button"

import HTML from "@/components/html"

export default function ResetPage() {
  const [races, racers, addRacer, clearRaces, clearRacers, clearConfig] =
    useRaceDayStore( s=>[s.races, s.racers, s.addRacer, s.clearRaces, s.clearRacers, s.clearConfig])

  const loadRacers = () => {
    const names = racers.map( r=>r.name )

    RACERS
      .filter( r => !names.includes(r.name) )
      .forEach( r => { addRacer( r.name, r.sailNumber, r.fleet ) })
  }

  return (
    <div>
      <HTML.BackHeader title="Clear data" />

      <section className="m-2 p-2 rounded-lg  grid grid-cols-2 gap-4 items-center bg-white">
        <HTML.H1 className="text-center !text-black">{ races.length } races</HTML.H1>
        <Button.Primary onClick={ clearRaces }>Clear all races</Button.Primary>
      
        <HTML.H1 className="text-center !text-black">{ racers.length } racers</HTML.H1>
        <Button.Primary onClick={ clearRacers }>Clear all racers</Button.Primary>
      
        <HTML.H1 className="text-center !text-black">Race day</HTML.H1>
        <Button.Primary onClick={ clearConfig }>Clear details</Button.Primary>
      
        <Button.Primary onClick={ loadRacers }>Load racers</Button.Primary>
      </section>

    </div>
  )
}