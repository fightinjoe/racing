'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import Form from "@/components/form"

export type RacerFormData = {
  name: string,
  sailNumber: string,
  fleet: FleetSchema
}

export default function AddPartial({ racer, onSave, onCancel }:
  {racer: RacerSchema | null, onSave: (d:RacerFormData)=>void, onCancel: ()=>void}) {
  const { register, handleSubmit, setValue } = useForm<RacerFormData>()

  useEffect(() => {
    if( !racer ) return

    setValue('name', racer.name)
    setValue('sailNumber', racer.sailNumber)
    setValue('fleet', racer.fleet)
  }, [racer])

  const onSubmit = (data: RacerFormData) => {
    onSave(data)

    setValue('name', '')
    setValue('sailNumber', '')
  }

  const handleCancel = () => {
    onCancel()
    setValue('name', '')
    setValue('sailNumber', '')

    return false
  }

  return (
    <form className="col-2 items-start" onSubmit={handleSubmit(onSubmit)}>
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

      <div className="row-4 w-full justify-end">
        {
          racer
          ? <button onClick={ handleCancel }>Cancel</button>
          : ''
        }
        <input type="submit" value={ racer ? 'Save changes' : 'Add' } className="ButtonSubmit" />
      </div>
    </form>
  )
}