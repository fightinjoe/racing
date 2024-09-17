'use client'

import { useRaceStore } from "@/stores/raceStore"
import { ChangeEventHandler, useState } from "react"

import HTML from "@/components/html"
import Race from "@/components/race"
import { toId } from "@/lib/string"

import { courseSchema } from "@/schemas/default"

export default function CourseSelection({fleet}: {fleet:FleetSchema}) {
  const races = useRaceStore(s=>s.races)
  const raceCount = races.filter(r => r.fleet === fleet).length

  const [course, setCourse] = useState<CourseSchema | undefined>()

  const imgs = [
    ['1_triangle.png',         '1. Triangle'],
    ['2_windward_leeward.png', '2. Windward Leeward'],
    ['3_golden_cup.png',       '3. Golden Cup'],
    ['4_wl_twice_around.png',  '4. WL twice around'],
    ['5_no_jibe.png',          '5. No Jibe'],
    ['6_no_jibe_upwind.png',   '6. No Jibe upwind finish'],
  ]

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setCourse( courseSchema.parse(e.target.value) )
  }

  return (
    <main className="p-4 col-4">
      <header className="row-2">
        <HTML.back />
        Race {raceCount+1} - {fleet} fleet
      </header>
      
      <div className="grid grid-cols-3 gap-2">
        { imgs.map( ([img, title],i) => (
            <div className="RadioTile" key={i}>
              <input
                type="radio"
                id={ toId(title) }
                name="course"
                value={title}
                checked={course === title}
                onChange={onChange}
              />
              <label htmlFor={ toId(title) } className="col-2 items-center">
                <img src={`/imgs/${img}`} className="h-[87px]" />
                <small className="text-center">{ title }</small>
              </label>
            </div>
        ) ) }
      </div>

      <Race.begin fleet={fleet} course={course} count={raceCount+1} disabled={ !course } />
    </main>
  )
}