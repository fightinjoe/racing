'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"

export default function Home() {
  const racers = useRaceDayStore(s=>s.racers)

  return (
    <main>
      <h1>Racers: { racers.size }</h1>
      <h1>Races: 0</h1>
    </main>
  );
}
