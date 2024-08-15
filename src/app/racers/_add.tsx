'use client'

import { ChangeEventHandler, MouseEventHandler, useState } from "react"
import { useContext } from "react"
import { RacersContext } from "@/state/racersContext"
import { Racer } from "@/models/helpers"

export default function AddPartial() {
  const [name, setName] = useState('')
  const { racersDispatch } = useContext(RacersContext)

  const handleNameChange: ChangeEventHandler = (e:any) => {
    setName( e.target.value )
  }

  const handleSubmit: MouseEventHandler = () => {
    const racer = Racer.create(name)
    racersDispatch({ type: 'add', racer })
    setName('')
  }

  return (
    <div>
      Name: <input type="text" value={name} onChange={ handleNameChange } />
      <button onClick={ handleSubmit }>Save</button>
    </div>
  )
}