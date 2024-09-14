import React from "react"
import { FieldValues, useForm, UseFormRegister, Path } from "react-hook-form"

interface FormParams<T> {
  defaultValues: T,
  children: React.ReactNode,
  onSubmit: () => void
}

interface RadioParams<T extends FieldValues> {
  name: Path<T>,
  register: UseFormRegister<T>,
  value: string,
  children: React.ReactNode,
  rest?: any
}

function Radio<T extends FieldValues>({name, register, value, children, ...rest}: RadioParams<T>) {
  const id = value
    .toString()
    .toLowerCase()
    .replace(/ /g,'-')          // replace ' ' with '-'
    .replace(/[^a-z0-9-]/g, '') // remove non alpha-numeric values

  return (
    <div>
      <input type="radio" id={ id } value={ value } {...register(name)} {...rest} />
      <label htmlFor={ id }>{ children }</label>
    </div>
  )
}

const FormComponents = {
  Radio
}

export default FormComponents