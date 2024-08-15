'use client'

import { useRacerStore } from "@/stores/racerStore"

export default function Home() {
  const racers = useRacerStore(s=>s.racers)

  return (
    <main>
      <h1>Racers: { racers.length }</h1>
      <h1>Races: 0</h1>
    </main>
  );
}
