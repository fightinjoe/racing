'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"

export default function Home() {
  const racers = useRaceDayStore(s=>s.racers)
  const races = useRaceDayStore(s=>s.races)

  return (
    <main>
      <h1>Racers: { racers.length }</h1>
      <h1>Races: { races.length }</h1>
    </main>
  );
}
