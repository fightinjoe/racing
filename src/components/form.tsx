import React from "react"
import { FieldValues, useForm, UseFormRegister, Path } from "react-hook-form"
import { toId } from "@/lib/string"

interface RadioProps<T extends FieldValues> {
  name: Path<T>,
  register?: UseFormRegister<T>,
  value: string,
  children: React.ReactNode,
  rest?: any
}

function Radio<T extends FieldValues>({name, register, value, children, ...rest}: RadioProps<T>) {
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

interface TextProps<T extends FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
    register?: UseFormRegister<T>,
    name: Path<T>
  }

function Text<T extends FieldValues>({ name, register, ...props }: TextProps<T>) {
  return (
    <input
      type="text"
      className={ `FormText ${props.className}`}
      {...(register ? register(name) : {})}
      { ...props }
    />
  )
}

const FormComponents = {
  Radio,
  Text
}

export default FormComponents