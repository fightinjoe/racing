import React from "react"
import { FieldValues, FieldErrors, UseFormRegister, Path } from "react-hook-form"
import { toId } from "@/lib/string"

import styles from "@/components/styles/form.module.css"

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
        ? <input type="radio" readOnly={true} id={ id } value={ value } {...register(name)} {...rest} />
        : <input type="radio" readOnly={true} id={ id } value={ value } {...rest} />
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
  // If a numeric value is not set this way, the error
  // "Expected number, received string" will be raised
  // let registerOptions = {}
  // if (props.type === 'number') registerOptions = { valueAsNumber: true }

  let registerOptions: any = {
    valueAsNumber: props.type === 'number'
  }

  return (
    <input
      type="text"
      {...(register ? register(name, registerOptions) : {})}
      { ...props }
      className={ `${styles.textInput} ${props.className || ''}`}
    />
  )
}

function ErrorMessage<T extends FieldValues>({name, errors, children}:
  {name:keyof T, errors: FieldErrors<T>, children?: React.ReactNode}) {

  const body = children || errors[name]?.message

  return (
    errors[name]
    ? <span className="text-red-500 text-sm">{ body as unknown as any }</span>
    : ''
  )
}

const FormComponents = {
  Radio,
  Text,
  Error: ErrorMessage
}

export default FormComponents