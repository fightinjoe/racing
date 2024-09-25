'use client'

import { useEffect } from "react"
import { useForm, FieldErrors } from "react-hook-form"
import { racerFormSchema } from "@/schemas/forms"
import { zodResolver } from "@hookform/resolvers/zod"

import Form from "@/components/form"

export default function AddPartial({ racer, onSave, onCancel }:
  {racer: RacerSchema | null, onSave: (d:RacerFormSchema)=>void, onCancel: ()=>void}) {
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<RacerFormSchema>({
    resolver: zodResolver(racerFormSchema)
  })

  useEffect(() => {
    if( !racer ) return

    setValue('name', racer.name)
    setValue('sailNumber', racer.sailNumber)
    setValue('fleet', racer.fleet)
  }, [racer])

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

  console.log('Errors', errors)

  return (
    <form className="col-2 items-start" onSubmit={handleSubmit(onSubmit)}>
      <Form.Text
        placeholder="Name"
        register={register}
        name="name"
      />
      <ErrorMessage name="name" errors={errors} />

      <Form.Text
        placeholder="Sail number"
        register={register}
        name="sailNumber"
      />
      <ErrorMessage name="sailNumber" errors={errors} />

      <fieldset className="RadioSlider">
        <Form.Radio name="fleet" value={'A'} register={register}>A fleet</Form.Radio>
        <Form.Radio name="fleet" value={'B'} register={register}>B fleet</Form.Radio>
      </fieldset>
      {<ErrorMessage name="fleet" errors={errors}>Please choose a racing fleet</ErrorMessage>}

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

function ErrorMessage({name, errors, children}:
  {name:keyof RacerFormSchema, errors: FieldErrors<RacerFormSchema>, children?: React.ReactNode}) {
  return (
    errors[name]
    ? <span className="text-red-500 text-sm">{ children || errors[name].message }</span>
    : ''
  )
}