'use client'

import { NavTile } from "@/components/tile"

import { useRaceStore } from "@/stores/raceStore"
import { useRacerStore } from "@/stores/racerStore"

export default function Home() {
  const racers = useRacerStore(s=>s.racers)
  const races = useRaceStore(s=>s.races)

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
