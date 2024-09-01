'use client'

import ListPartial from "./_list"
import AddPartial from "./_add"
import HTML from "@/components/html"

export default function RacersPage() {
  return (
    <main>
      <header className="flex flex-row p-4">
        <HTML.back />
        <HTML.h1>Racers</HTML.h1>
      </header>

      <div>
        <AddPartial />
        <ListPartial />
      </div>
    </main>
  )
}