'use client'

import { useState } from "react"
import { useRaceDayStore } from "@/stores/raceDayStore"

import { RacerTile } from "@/components/tile"
import Form from "@/components/form"

import { capitalize, sortSailNumbers } from "@/lib/string"

export default function ListPartial(params: {racers:RacerSchema[], race:RaceSchema, sorts?:RacersSort[]}) {
  const sorts = params.sorts || ['added', 'name', 'number', 'fleet']
  const finishRacer = useRaceDayStore(s=>s.finishRacer)

  const [sort, setSort] = useState<RacersSort>( sorts[0] )

  const handleClick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSort(e.target.value as RacersSort)
  }

  const props = (value:string) => ({
    name: 'sort',
    onClick: handleClick,
    value,
    checked: sort === value
  })

  return (
    <div className="row-wrap-2 p-4">

      <fieldset className="RadioTabs row-2">
        {
          sorts.map( (s,i) => (
            <Form.Radio {...props(s)}>{
              s === 'added' ? 'Default' :
              s === 'number' ? 'Sail number' :
              capitalize(s)
            }</Form.Radio>
          ))
        }
      </fieldset>

      {
        params.racers
          .sort( (r1, r2) => 
            sort === 'added'  ?  (r1.id > r2.id ? -1 : 1) :
            sort === 'name'   ? (r1.name < r2.name ? -1 : 1) :
            sort === 'number' ? sortSailNumbers(r1.sailNumber, r2.sailNumber) :
            sort === 'fleet'  ? (r1.fleet === r2.fleet ? sortSailNumbers(r1.sailNumber, r2.sailNumber) : (r1.fleet < r2.fleet ? -1 : 1)) :
            -1
          )
          .map( (r,i) => <RacerTile key={i} racer={r} onClick={()=>finishRacer(r, params.race)} /> )
      }
    </div>
  )
}