import React from "react"
import { FieldValues, useForm, UseFormRegister, Path } from "react-hook-form"
import { toId } from "@/lib/string"

interface RadioParams<T extends FieldValues> {
  name: Path<T>,
  register?: UseFormRegister<T>,
  value: string,
  children: React.ReactNode,
  rest?: any
}

function Radio<T extends FieldValues>({name, register, value, children, ...rest}: RadioParams<T>) {
  const id = toId(value)

  return (
    <div>
      {
        register
        ? <input type="radio" id={ id } value={ value } {...register(name)} {...rest} />
        : <input type="radio" id={ id } value={ value } {...rest} />
      }
      <label htmlFor={ id }>{ children }</label>
    </div>
  )
}

const FormComponents = {
  Radio
}

export default FormComponents