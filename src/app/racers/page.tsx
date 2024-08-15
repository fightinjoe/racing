import ListPartial from "./_list"
import AddPartial from "./_add"

export default function RacersPage() {
  return (
    <h1>
      Racers
      <AddPartial />
      <ListPartial />
    </h1>
  )
}