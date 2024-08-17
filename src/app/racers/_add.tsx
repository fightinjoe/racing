'use client'

import { ChangeEventHandler, MouseEventHandler, useState } from "react"
import { Participant } from "@/models/default"
import { useRacerStore } from "@/stores/racerStore"

export default function AddPartial() {
  const [name, setName] = useState('')
  const addRacer = useRacerStore(s=>s.addRacer)

  const handleNameChange: ChangeEventHandler = (e:any) => {
    setName( e.target.value )
  }

  const handleSubmit: MouseEventHandler = () => {
    const racer = Participant.createRacer(name)
    addRacer(racer)
    setName('')
  }

  return (
    <div>
      Name:
        <input
          type="text"
          value={name}
          onChange={ handleNameChange }
          className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
        />

      <button onClick={ handleSubmit }>Save</button>
    </div>
  )
}