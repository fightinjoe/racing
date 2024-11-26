'use client'

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { racerFormSchema } from "@/schemas/forms"
import { zodResolver } from "@hookform/resolvers/zod"

import Form from "@/components/form"
import Button from "@/components/button"

import styles from "./page.module.css"
import { useRaceDayStore } from "@/stores/raceDayStore"

/**
 * Modal tray that allows for the adding and editing of a racer
 * @param param
 * @returns 
 */
export default function AddRacer({ racer, onSave, onCancel }:
  {racer: RacerSchema | null, onSave: (d:RacerFormSchema)=>void, onCancel: ()=>void}) {
  
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors }
  } = useForm<RacerFormSchema>({
    resolver: zodResolver(racerFormSchema)
  })

  useEffect(() => {
    // If there is no racer, set the default fleet to 'A'
    if( !racer ) {
      setValue('fleet', 'A')
      return
    }

    // If there is a racer (editing), set the form values to the racer's values
    setValue('name', racer.name)
    setValue('sailNumber', racer.sailNumber)
    setValue('fleet', racer.fleet)

    // validate the form (e.g. when adding a racer from the roster)
    trigger('sailNumber')
  }, [racer, setValue])

  const onSubmit = (data: RacerFormSchema) => {
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
    <form
      className={ styles.form }
      onSubmit={handleSubmit(onSubmit)}
    >
      <Form.Text
        placeholder="Name"
        register={register}
        name="name"
      />
      <Form.Error name="name" errors={errors} />

      <Form.Text
        placeholder="Sail number"
        register={register}
        name="sailNumber"
      />
      <Form.Error name="sailNumber" errors={errors} />

      <fieldset className="RadioSlider">
        <Form.Radio name="fleet" value={'A'} register={register}>A fleet</Form.Radio>
        <Form.Radio name="fleet" value={'B'} register={register}>B fleet</Form.Radio>
      </fieldset>
      {<Form.Error name="fleet" errors={errors}>Please choose a racing fleet</Form.Error>}

      <div className="row-2 w-full justify-end">
        <button type="button" onClick={ handleCancel } className="button-cancel">Cancel</button>
        <Button.Submit
          value={ racer ? 'Save changes' : 'Add' }
          className={ racer ? styles.editButton : ''}
        />
      </div>
    </form>
  )
}