'use client'

import { NavTile } from "@/components/tile"

import { useRaceDayStore } from "@/stores/raceDayStore"

export default function Home() {
  const racers = useRaceDayStore(s=>s.racers)
  const races = useRaceDayStore(s=>s.races)

  return (
    <main>
      <NavTile
        title="Racers"
        subtitle={ racers.length+'' }
        href="/racers"
      />
      
      <NavTile
        title="Races"
        subtitle={ races.length+'' }
        href="/races"
      />
    </main>
  );
}
