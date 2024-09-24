'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"

import { useRacerSort } from "./_list"

import AddPartial from "./_add"
import HTML from "@/components/html"
import { RacerTile } from "@/components/tile"

export default function RacersPage() {
  const racers = useRaceDayStore(s => s.racers)

  const {sort, Tabs, helpSortRacers} = useRacerSort()

  return (
    <main>
      <header className="p-4 row-2">
        <HTML.back />
        <HTML.h1>Racers</HTML.h1>
      </header>

      <section className="bg-white p-4">
        <AddPartial />
      </section>

      <section className="p-4 col-4 bg-gray-100 shadow-inner">
        <Tabs />

        <div className="row-wrap-2">{
          racers.sort( helpSortRacers ).map( (r,i) => (
            <RacerTile key={i} racer={r} />
          ))
        }</div>
      </section>

      <div>
        {/* <ListPartial racers={racers} /> */}
      </div>
    </main>
  )
}