import ListPartial from "./_list"
import AddPartial from "./_add"

export default function RacersPage() {
  return (
    <div>
      <h1 className="font-bold text-xl">Racers</h1>
      <AddPartial />
      <ListPartial />
    </div>
  )
}