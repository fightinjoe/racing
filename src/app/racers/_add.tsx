'use client'

import { useRacerStore } from "@/stores/racerStore"
// import { ChangeEventHandler, MouseEventHandler, useState } from "react"
import { useForm } from "react-hook-form"

import Form from "@/components/form"

type _FormData = {
  name: string,
  sailNumber: string,
  fleet: FleetSchema
}

export default function AddPartial() {
  // const [name, setName] = useState('')
  // const [sailNumber, setSailNumber] = useState('')

  const { register, reset, handleSubmit, setValue } = useForm<_FormData>()

  const addRacer = useRacerStore(s=>s.addRacer)

  // const handleNameChange: ChangeEventHandler = (e:any) => {
  //   setName( e.target.value )
  // }

  // const handleSailNumberChange: ChangeEventHandler = (e:any) => {
  //   setSailNumber( e.target.value )
  // }
  
  const onSubmit = (data: _FormData) => {
    console.log('submitted data', data)
    addRacer(data.name, data.sailNumber, data.fleet)

    setValue('name', '')
    setValue('sailNumber', '')
  }

  return (
    <form className="p-4" onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        placeholder="Name"
        className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
        {...register('name')}
      />

      <input
        type="text"
        placeholder="Sail number"
        className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
        {...register('sailNumber')}
      />

      <fieldset className="SelectBox">
        <Form.Radio name="fleet" value={'A'} register={register}>A fleet</Form.Radio>
        <Form.Radio name="fleet" value={'B'} register={register}>B fleet</Form.Radio>
      </fieldset>

      <input type="submit" value="Add" className="ButtonSubmit" />
    </form>
  )
}