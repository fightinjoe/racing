import { useRaceStore } from "@/stores/raceStore"

export default function FinishRacerPartial({race, racer}: {race: RaceSchema, racer:RacerSchema}) {
  const finishRacer = useRaceStore(s=>s.finishRacer)

  const handleFinishClick = () => {
    finishRacer(racer, race)
  }

  return (
    <li key={racer.id}>
      <button onClick={ handleFinishClick }>
        { racer.name}
      </button>
      </li>
  )
}