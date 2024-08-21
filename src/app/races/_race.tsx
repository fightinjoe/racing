import Link from "next/link"

export default function RacePartial({race}: {race: RaceSchema}) {
  return (
    <div>
      <Link href={`/races/${race.id}`}>Ongoing: Race {race.id}</Link>
    </div>
  )
}