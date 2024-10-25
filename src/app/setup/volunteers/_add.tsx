'use client'

import { useEffect } from "react"
import { useForm, FieldErrors } from "react-hook-form"
import { volunteerFormSchema } from "@/schemas/forms"
import { zodResolver } from "@hookform/resolvers/zod"

import Form from "@/components/form"
import Button from "@/components/button"

export default function AddVolunteer({ volunteer, onSave, onCancel }:
  {volunteer: VolunteerSchema | null, onSave: (d:VolunteerFormSchema)=>void, onCancel: ()=>void}) {
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<VolunteerFormSchema>({
    resolver: zodResolver(volunteerFormSchema)
  })

  useEffect(() => {
    if( !volunteer ) {
      setValue('role', 'Volunteer')
      return
    }

    setValue('name', volunteer.name)
    setValue('role', volunteer.role)
  }, [volunteer, setValue])

  const onSubmit = (data: VolunteerFormSchema) => {
    onSave(data)

    setValue('name', '')
  }

  const handleCancel = () => {
    onCancel()
    setValue('name', '')

    return false
  }

  return (
    <form className="col-2 items-start" onSubmit={handleSubmit(onSubmit)}>
      <Form.Text
        placeholder="Name"
        register={register}
        name="name"
      />
      <ErrorMessage name="name" errors={errors} />

      <fieldset className="RadioSlider">
        <Form.Radio name="role" value={'Race committee'} register={register}>RC chair</Form.Radio>
        <Form.Radio name="role" value={'Volunteer'} register={register}>RC volunteer</Form.Radio>
        <Form.Radio name="role" value={'Crash boat'} register={register}>Crash boat</Form.Radio>
      </fieldset>
      {<ErrorMessage name="role" errors={errors}>Please choose a volunteer role</ErrorMessage>}

      <div className="row-0 w-full justify-end">
        <Button.Cancel onClick={ handleCancel } />
        <Button.Submit value={ volunteer ? 'Save changes' : 'Add' } />
      </div>
    </form>
  )
}

function ErrorMessage({name, errors, children}:
  {name:keyof VolunteerFormSchema, errors: FieldErrors<VolunteerFormSchema>, children?: React.ReactNode}) {
  return (
    errors[name]
    ? <span className="text-red-500 text-sm">{ children || errors[name].message }</span>
    : ''
  )
}