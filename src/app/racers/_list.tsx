'use client'

import { useState } from "react"

import { useRacerStore } from "@/stores/racerStore"
import { RacerTile } from "@/components/tile"
import Form from "@/components/form"

import { sortSailNumbers } from "@/lib/string"

export default function ListPartial() {
  const racers = useRacerStore(s=>s.racers)

  const [sort, setSort] = useState<RacersSort>('number')

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
        <Form.Radio {...props('added')}>Added</Form.Radio>
        <Form.Radio {...props('name')}>Name</Form.Radio>
        <Form.Radio {...props('number')}>Sail number</Form.Radio>
        <Form.Radio {...props('fleet')}>Fleet</Form.Radio>
      </fieldset>

      {
        racers
          .sort( (r1, r2) => 
            sort === 'added'  ?  -1 :
            sort === 'name'   ? (r1.name < r2.name ? -1 : 1) :
            sort === 'number' ? sortSailNumbers(r1.sailNumber, r2.sailNumber) :
            sort === 'fleet'  ? (r1.fleet === r2.fleet ? sortSailNumbers(r1.sailNumber, r2.sailNumber) : (r1.fleet < r2.fleet ? -1 : 1)) :
            -1
          )
          .map( (r,i) => <RacerTile key={i} racer={r} /> )
      }
    </div>
  )
}