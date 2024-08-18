'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"

export default function RacePage({params}: {params: {id: string}}) {
  const race = useRaceDayStore(s=>s.findRace)(params.id)
  const { racers, finishers } = useRaceDayStore(s=>s.getRaceDetails)(race)
  const findSailor = useRaceDayStore(s=>s.findSailor)

  return (
    <div>
      Single race { race.id }

      <ul>
        {
          Array.from(racers.entries()).map( ([id, racer]) => (
            <li key={id}>{ findSailor(racer.sailorId).name}</li>
          ))
        }
      </ul>
    </div>
  )
}