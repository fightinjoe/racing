'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"
import FinishRacerPartial from "./_finishRacer"

export default function RacePage({params}: {params: {id: string}}) {
  const race = useRaceDayStore(s=>s.findRace)(params.id)
  const { allRacers, racers } = useRaceDayStore(s=>s.getRaceDetails)(race)
  const findSailor = useRaceDayStore(s=>s.findSailor)
  const finishers = useRaceDayStore(s=>s.finishers)

  return (
    <div>
      Single race { race.id }

      <h2><strong>Still racing</strong></h2>
      <ul>
        {
          racers.map( (r,i) => <FinishRacerPartial key={i} race={race} racer={r} /> )
        }
      </ul>

      <h2><strong>Finshers</strong></h2>
      <ul>
        {
          finishers
          .filter( f => f.raceId === race.id )
          .map( (f,i) => 
            <li key={i}>{ findSailor(f.participantId).name }</li>
          )
        }
      </ul>
    </div>
  )
}