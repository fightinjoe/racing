'use client'

// import { useRaceDayStore } from "@/stores/raceDayStore"
import { useRacerStore } from "@/stores/racerStore"
import { RacerTile } from "@/components/tile"

export default function ListPartial() {
  const racers = useRacerStore(s=>s.racers)

  return (
    <div className="row-wrap-2 p-4">
      { racers.map( (r,i) => <RacerTile key={i} racer={r} /> )}
    </div>
  )
}