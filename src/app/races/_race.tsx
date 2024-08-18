import Link from "next/link"

export default function RacePartial({race}: {race: RaceSchema}) {
  return (
    <div>
      <Link href={`/races/${race.id}`}>Race {race.id}</Link>
    </div>
  )
}