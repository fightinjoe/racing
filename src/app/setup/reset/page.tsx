'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"

import Button from "@/components/button"

import HTML from "@/components/html"

export default function ResetPage() {
  const [races, racers, clearRaces, clearRacers, clearConfig] =
    useRaceDayStore( s=>[s.races, s.racers, s.clearRaces, s.clearRacers, s.clearConfig])

  return (
    <div>
      <HTML.BackHeader title="Clear data" />

      <section className="m-2 p-2 rounded-lg  grid grid-cols-2 gap-4 items-center bg-white">
        <HTML.H1 className="text-center">{ races.length } races</HTML.H1>
        <Button.Primary onClick={ clearRaces }>Clear all races</Button.Primary>
      
        <HTML.H1 className="text-center">{ racers.length } racers</HTML.H1>
        <Button.Primary onClick={ clearRacers }>Clear all racers</Button.Primary>
      
        <HTML.H1 className="text-center">Race day</HTML.H1>
        <Button.Primary onClick={ clearConfig }>Clear details</Button.Primary>
      </section>

    </div>
  )
}