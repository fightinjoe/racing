'use client'

import { useRacerStore } from "@/stores/racerStore"
import { ChangeEventHandler, MouseEventHandler, useState } from "react"

export default function AddPartial() {
  const [name, setName] = useState('')
  const [sailNumber, setSailNumber] = useState('')

  const addRacer = useRacerStore(s=>s.addRacer)

  const handleNameChange: ChangeEventHandler = (e:any) => {
    setName( e.target.value )
  }

  const handleSailNumberChange: ChangeEventHandler = (e:any) => {
    setSailNumber( e.target.value )
  }
  
  const handleSubmit: MouseEventHandler = () => {
    addRacer(name, sailNumber)
    setName('')
    setSailNumber('')
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

        <input
          type="text"
          value={sailNumber}
          onChange={ handleSailNumberChange }
          className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
        />

      <button onClick={ handleSubmit }>Save</button>
    </div>
  )
}