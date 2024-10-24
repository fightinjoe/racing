'use client'

import { useEffect } from 'react'
import { useForm, FieldValues, Path, UseFormRegister } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useRaceDayStore } from '@/stores/raceDayStore'
import { conditionsSchema, windDirectionSchema } from '@/schemas/default'
import { zodResolver } from '@hookform/resolvers/zod'

import Form from '@/components/form'
import HTML from '@/components/html'
import Button from '@/components/button'

export default function ConditionsPage() {
  const router = useRouter()
  const [conditions, updateConditions] = useRaceDayStore(s=>[s.conditions, s.updateConditions])

  const {
    register, reset, handleSubmit, setValue, formState: { errors }
  } = useForm<ConditionsSchema>({ resolver: zodResolver(conditionsSchema)})
  
  // Since Zustan is caching data in local storage, the 'data' param
  // changes with hydration. react-hook-form prevents the re-render
  // when the param changes, however, so `useEffect` is used to force
  // a reset of the form values. Zustan's `onFinishHydration` was
  // attempted to be used, but `useDetailsStore.persis` was undefined 🤷
  useEffect(() => { reset(conditions) }, [conditions])

  const onSubmit = (data: ConditionsSchema) => {
    let newConditions = {} as ConditionsSchema

    newConditions.windSpeed = data.windSpeed
    newConditions.gustSpeed = data.gustSpeed

    newConditions.windDirectionMin = data.windDirectionMin
    newConditions.windDirectionMax = data.windDirectionMax

    newConditions.temperatureMax = data.temperatureMax
    newConditions.temperatureMin = data.temperatureMin

    newConditions.current = data.current

    updateConditions(newConditions)

    router.back()
  }

  return (
    <main>
      <HTML.BackHeader title="Conditions" />

      <section className="bg-white rounded m-4 p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="col-6">

          <div className="col-1">
            <div className="row-2 items-center">
              <span className="grow">Temperature</span>

              <Form.Text
                placeholder="Low"
                register={register}
                name="temperatureMin"
                type="number"
                className="!w-[4em]"
              />

              <Form.Text
                placeholder="High"
                register={register}
                name="temperatureMax"
                type="number"
                className="!w-[4em]"
              />
            </div>
            <FormError error={ errors['temperatureMax']?.message || errors['temperatureMin']?.message} />
          </div>

          <div className="col-1">
            <div className="row-2 items-center">
              <span className="grow">Wind speed</span>

              <Form.Text
                placeholder="Low"
                register={register}
                name="windSpeed"
                type="number"
                className="!w-[4em]"
              />

              <Form.Text
                placeholder="High"
                register={register}
                name="gustSpeed"
                type="number"
                className="!w-[4em]"
              />
            </div>
            <FormError error={ errors['gustSpeed']?.message || errors['windSpeed']?.message} />
          </div>

          <div className="row-2 items-center">
            <span className="grow">Wind direction</span>

            <select {...register("windDirectionMax")}>
              { windDirectionSchema.options.map((dir, i) => <option key={i} value={dir}>{dir}</option>) }
            </select>

            <select {...register("windDirectionMin")}>
              { windDirectionSchema.options.map((dir, i) => <option key={i} value={dir}>{dir}</option>) }
            </select>
          </div>

          <FormError error={ errors['windDirectionMax']?.message || errors['windDirectionMin']?.message} />

          <div className="row-2 items-center mb-4">
            <span className="grow">Tide</span>

            <fieldset className="RadioSlider">
              <Form.Radio
                register={register}
                name="current"
                value="high tide"
              >High</Form.Radio>

              <Form.Radio
                register={register}
                name="current"
                value="ebb"
              >Ebb</Form.Radio>

              <Form.Radio
                register={register}
                name="current"
                value="low tide"
              >Low</Form.Radio>

              <Form.Radio
                register={register}
                name="current"
                value="flood"
              >Flood</Form.Radio>
            </fieldset>
          </div>

          <div className="row-0 w-full justify-end">
            <Button.Cancel />
            <Button.Submit value="Save" />
          </div>
        </form>
      </section>
    </main>
  )
}

function FormError({error}: {error?: string}) {
  return (
    error
    ? <span className="text-red-500 text-sm">{ error }</span>
    : ''
  )
}


// function HighLow<T extends FieldValues>({name, title, register}: {name: Path<T>, title: string, register: UseFormRegister<T>}) {
//   return (
//     <div className="col-2">
//       <div className="row-2">
//         <span>{title}</span>

//         <Form.Text
//           placeholder="Temperature"
//           register={register}
//           name={name}
//           type="number"
//         />
//       </div>
      
//       <Form.Error name="temperature" errors={errors} />
//     </div>
//   )
// }