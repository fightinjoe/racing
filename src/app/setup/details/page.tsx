'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import HTML from "@/components/html"
import Form from '@/components/form'
import { useRaceDayStore } from "@/stores/raceDayStore"
import Button from '@/components/button'

type MyFormData = {
  sailSize: SailSizeSchema,
  // react-hook-form wasn't registering changes with type <number>,
  // so a string is used instead
  raceSeparateFleets: string
}

export default function DetailsPage() {
  const [config, updateConfig] = useRaceDayStore(s=>[s.config,s.updateConfig])
  const router = useRouter()
  
  const handleSubmit = (data: MyFormData) => {
    let newConfig = {} as ConfigSchema

    newConfig.sailSize = data.sailSize

    newConfig.raceSeparateFleets = data.raceSeparateFleets === 'true'

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
    raceSeparateFleets: data.raceSeparateFleets+''
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
  useEffect(() => { reset(formData) }, [reset, formData])

  const handleReset = () => {
    reset(formData)
    return false
  }
  

  return (
    <main>
      <HTML.BackHeader title="Race details" />

      <main className="m-2 p-2 rounded bg-white">
        <form
          className="col-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <HTML.H2 className="!text-black">Sail size</HTML.H2>

          <fieldset className="RadioSlider mb-4">
            <Form.Radio name="sailSize" value="small" register={register}>Small</Form.Radio>
            <Form.Radio name="sailSize" value="large" register={register}>Large</Form.Radio>
          </fieldset>

          <HTML.H2 className="!text-black">Fleet size</HTML.H2>

          <fieldset className="RadioSlider">
            <Form.Radio name="raceSeparateFleets" value={'false'} register={register}>Single fleet</Form.Radio>
            <Form.Radio name="raceSeparateFleets" value={'true'} register={register}>Separate fleets</Form.Radio>
          </fieldset>

          <div className="row-4 justify-end mt-6">
            <button onClick={ handleReset } className="ButtonCancel" type="button">Reset</button>
            <Button.Submit value="Save" />
          </div>

        </form>
      </main>
    </main>
  )
}

/**
 * Renders a radio button with label
 * @returns 
 */
