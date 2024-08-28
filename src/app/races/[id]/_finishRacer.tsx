import { useRaceStore } from "@/stores/raceStore"
import { RacerTile } from "@/components/tile"

export default function FinishRacerPartial({race, racer}: {race: RaceSchema, racer:RacerSchema}) {
  const finishRacer = useRaceStore(s=>s.finishRacer)

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