import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <Link href="/racers">Racers</Link>
      <Link href="/races">Races</Link>
    </main>
  );
}
