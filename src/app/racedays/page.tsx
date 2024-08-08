import { RaceDay } from '@/models/raceday'
import CreateRaceDayButton from './createButton'

export default async function Home() {
  const racedays = await RaceDay.all()

  return (
    <main>
      Racedays

      <p><CreateRaceDayButton /></p>

      <ul>
        {racedays.map(raceday => (
          <li key={raceday.id}>{raceday.id}</li>
        ))}
      </ul>
    </main>
  );
}