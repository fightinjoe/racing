'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"
// import { ChangeEventHandler, MouseEventHandler, useState } from "react"
import { useForm } from "react-hook-form"

import Form from "@/components/form"

type _FormData = {
  name: string,
  sailNumber: string,
  fleet: FleetSchema
}

export default function AddPartial() {
  const { register, handleSubmit, setValue } = useForm<_FormData>()

  const addRacer = useRaceDayStore(s=>s.addRacer)
  
  const onSubmit = (data: _FormData) => {
    console.log('submitted data', data)
    addRacer(data.name, data.sailNumber, data.fleet)

    setValue('name', '')
    setValue('sailNumber', '')
  }

  return (
    <form  className="col-2 items-start" onSubmit={handleSubmit(onSubmit)}>
      <Form.Text
        placeholder="Name"
        register={register}
        name="name"
      />

      <Form.Text
        placeholder="Sail number"
        register={register}
        name="sailNumber"
      />

      <fieldset className="RadioSlider">
        <Form.Radio name="fleet" value={'A'} register={register}>A fleet</Form.Radio>
        <Form.Radio name="fleet" value={'B'} register={register}>B fleet</Form.Radio>
      </fieldset>

      <input type="submit" value="Add" className="ButtonSubmit" />
    </form>
  )
}