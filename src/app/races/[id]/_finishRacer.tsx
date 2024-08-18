import { useRaceDayStore } from "@/stores/raceDayStore"

export default function FinishRacerPartial({race, racer}: {race: RaceSchema, racer:ParticipantSchema}) {
  const findSailor = useRaceDayStore(s=>s.findSailor)
  const finishRacer = useRaceDayStore(s=>s.finishRacer)

  const handleFinishClick = () => {
    finishRacer(race, racer)
  }

  return (
    <li key={racer.sailorId}>
      <button onClick={ handleFinishClick }>
        { findSailor(racer.sailorId).name}
      </button>
      </li>
  )
}