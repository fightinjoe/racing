'use client'

import { ChangeEventHandler, MouseEventHandler, useState } from "react"
import { Racer } from "@/models/helpers"
import { useRacersStore } from "@/stores/racersStore"

export default function AddPartial() {
  const [name, setName] = useState('')
  const addRacer = useRacersStore(s=>s.addRacer)

  const handleNameChange: ChangeEventHandler = (e:any) => {
    setName( e.target.value )
  }

  const handleSubmit: MouseEventHandler = () => {
    const racer = Racer.create(name)
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