'use client'

import { useState } from "react"
import Form from "@/components/form"

import { capitalize, sortSailNumbers } from "@/lib/string"

import styles from "./styles/useRacerSort.module.css"

/**
 * Hook that provides a functional component for displaying a set of
 * tabs used for sorting a list of racers.
 * @param params.sorts An array of strings that represent the sorting options. Options
 * are 'added', 'name', 'number', and 'fleet'. The default is ['added', 'name', 'number', 'fleet'].
 * @returns sort: RacersSort
 * @returns response.Tabs: React.FC<{darkMode?:boolean}>
 * @returns response.helpSortRacers: A sorting callback function for Array.sort
 * 
 * @example
 * const {Tabs, helpSortRacers} = useRacerSort()
 * const racers: RacerSchema[] = ...
 * 
 * return (
 *  <Tabs />
 *  { racers.sort(helpSortRacers).map( racer => <RacerTile key={racer.id} racer={racer} /> ) }
 * )
 * 
 */
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

  const Tabs = ({darkMode}: {darkMode?:boolean}) => {
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
      <fieldset className={`${styles.RadioTabs} ${ darkMode && styles.dark}`}>
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