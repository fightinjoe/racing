'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"

import ListPartial from "./_list"
import AddPartial from "./_add"
import HTML from "@/components/html"

export default function RacersPage() {
  const racers = useRaceDayStore(s => s.racers)

  return (
    <main>
      <header className="p-4 row-2">
        <HTML.back />
        <HTML.h1>Racers</HTML.h1>
      </header>

      <div>
        <AddPartial />
        <ListPartial racers={racers} />
      </div>
    </main>
  )
}