'use client'

import { create } from "@/models/raceday.actions"

export default function CreateRaceDayButton() {
  const handleClick = async () => {
    await create()
  }

  return (
    <button onClick={ handleClick }>Create RaceDay</button>
  )
}