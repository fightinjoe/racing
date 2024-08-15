'use client'

import { useRacersStore } from "@/stores/racersStore"

export default function Home() {
  const racers = useRacersStore(s=>s.racers)

  return (
    <main>
      <h1>Racers: { racers.length }</h1>
      <h1>Races: 0</h1>
    </main>
  );
}
