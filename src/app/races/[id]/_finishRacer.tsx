import { useRaceStore } from "@/stores/raceStore"
import Tile from "@/components/tile"

export default function FinishRacerPartial({race, racer}: {race: RaceSchema, racer:RacerSchema}) {
  const finishRacer = useRaceStore(s=>s.finishRacer)

  const handleFinishClick = () => {
    finishRacer(racer, race)
  }

  return (
    <Tile
      title={ racer.name }
      subtitle=""
      onClick={ handleFinishClick }
    />
  )
}