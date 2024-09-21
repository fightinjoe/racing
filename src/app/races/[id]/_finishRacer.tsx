import { useRaceDayStore } from "@/stores/raceDayStore"
import { RacerTile } from "@/components/tile"

export default function FinishRacerPartial({race, racer}: {race: RaceSchema, racer:RacerSchema}) {
  const finishRacer = useRaceDayStore(s=>s.finishRacer)

  const handleFinishClick = () => {
    finishRacer(racer, race)
  }

  return (
    <RacerTile
      racer={ racer }
      onClick={ handleFinishClick }
    />
  )
}