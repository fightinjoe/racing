'use client'

import { useState } from "react"
import Form from "@/components/form"

import { capitalize, sortSailNumbers } from "@/lib/string"

import styles from "./useRacerSort.module.css"

export function useRacerSort(params: {sorts?:RacersSort[]} = {}) {
  const sorts = params.sorts || ['added', 'name', 'number', 'fleet']

  const [sort, setSort] = useState<RacersSort>( sorts[0] )

  const helpSortRacers = (r1: RacerSchema, r2: RacerSchema ) => (
    sort === 'added'  ?  (r1.id > r2.id ? -1 : 1) :
    sort === 'name'   ? (r1.name < r2.name ? -1 : 1) :
    sort === 'number' ? sortSailNumbers(r1.sailNumber, r2.sailNumber) :
    sort === 'fleet'  ? (r1.fleet === r2.fleet ? sortSailNumbers(r1.sailNumber, r2.sailNumber) : (r1.fleet < r2.fleet ? -1 : 1)) :
    -1
  )

  const Tabs = () => {
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
      <fieldset className={`${styles.RadioTabs} row-2`}>
        {
          sorts.map( (s,i) => (
            <Form.Radio key={i} {...props(s)}>{
              s === 'added' ? 'Default' :
              s === 'number' ? 'Sail number' :
              capitalize(s)
            }</Form.Radio>
          ))
        }
      </fieldset>
    )
  }

  return {sort, Tabs, helpSortRacers}
}