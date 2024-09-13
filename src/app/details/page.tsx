'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import HTML from "@/components/html"
import { useDetailsStore } from "@/stores/detailsStore"

type MyFormData = {
  sailSize: SailSizeSchema,
  // react-hook-form wasn't registering changes with type <number>,
  // so a string is used instead
  fleetSize: string
}

export default function DetailsPage() {
  const [config, updateConfig] = useDetailsStore(s=>[s.config,s.updateConfig])
  const router = useRouter()
  
  const handleSubmit = (data: MyFormData) => {
    let newConfig = {} as ConfigSchema

    newConfig.sailSize = data.sailSize

    newConfig.fleets = data.fleetSize === '1'
      ? ['AB']
      : ['A', 'B']

    updateConfig( newConfig )

    router.back()
  }

  return (
    <FormPartial
      data={ config }
      onSubmit={ handleSubmit }
    />
  )
}

function FormPartial({ data, onSubmit }: {data: ConfigSchema, onSubmit: (data:MyFormData) => void}) {
  const formData: MyFormData = {
    sailSize: data.sailSize,
    fleetSize: data.fleets.length.toString()
  }

  /** Form registration **/
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<MyFormData>()

  // Since Zustan is caching data in local storage, the 'data' param
  // changes with hydration. react-hook-form prevents the re-render
  // when the param changes, however, so `useEffect` is used to force
  // a reset of the form values. Zustan's `onFinishHydration` was
  // attempted to be used, but `useDetailsStore.persis` was undefined 🤷
  useEffect(() => { reset(formData) }, [data])

  const handleReset = () => {
    reset(formData)
    return false
  }

  function _Radio({dataKey, value, children}: {dataKey:any, value:any, children: React.ReactNode}) {
    const id = value
      .toString()
      .toLowerCase()
      .replace(/ /g,'-')          // replace ' ' with '-'
      .replace(/[^a-z0-9-]/g, '') // remove non alpha-numeric values
  
    return (
      <div>
        <input type="radio" id={ id } {...{value}} {...register(dataKey)} />
        <label htmlFor={ id }>{ children }</label>
      </div>
    )
  }

  return (
    <main>
      <header className="p-4 row-2">
        <HTML.back />
        <HTML.h1>Race details</HTML.h1>
      </header>

      <div className="p-4">
        <form
          className="col-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <HTML.h1>Sail size</HTML.h1>

          <fieldset className="SelectBox mb-4">
            <_Radio dataKey="sailSize" value="small">Small</_Radio>
            <_Radio dataKey="sailSize" value="large">Large</_Radio>
          </fieldset>

          <HTML.h1>Fleet size</HTML.h1>

          <fieldset className="SelectBox">
            <_Radio dataKey="fleetSize" value={'1'}>1 single fleet</_Radio>
            <_Radio dataKey="fleetSize" value={'2'}>2 separate fleets</_Radio>
          </fieldset>

          <div className="row-4 justify-end mt-6">
            <button onClick={ handleReset } className="ButtonCancel" type="button">Reset</button>
            <input type="submit" value="Save" className="ButtonSubmit" />
          </div>

        </form>
      </div>
    </main>
  )
}

/**
 * Renders a radio button with label
 * @returns 
 */
