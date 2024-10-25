import { useState } from "react"
import type { ChangeEventHandler } from "react"

import HTML from "@/components/html"
import Race from "@/components/race"

import { toId } from "@/lib/string"

import formStyles from "@/components/styles/form.module.css"

export default function CourseChooser({fleet, count, onCancel}:
  {fleet?:FleetSchema, count:number, onCancel: ()=>void}) {
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
    setCourse(e.target.value as CourseSchema)
  }

  const handleCancel = () => {
    onCancel()
    setCourse(undefined)
  }

  return (
    <div className="bg-white mx-2 p-2 py-4 rounded col-4 items-end max-w-[390px]">
      <HTML.H2 className="!text-black w-full">Choose course</HTML.H2>
      <div className="grid grid-cols-3 gap-2 px-2">
        { imgs.map( ([img, title],i) => (
            <div className={ formStyles.RadioTile } key={i}>
              <input
                type="radio"
                id={ toId(title) }
                name="course"
                value={title}
                checked={course === title}
                onChange={onChange}
              />
              <label htmlFor={ toId(title) } className="col-2 items-center">
                <img src={`/imgs/${img}`} className="h-[87px]" alt={title} />
                <small className="text-center">{ title }</small>
              </label>
            </div>
        ) ) }
      </div>

      <div className="row-4 flex-row-reverse">
        <Race.Start fleet={fleet} course={course!} count={count} disabled={ !course } />
        <button onClick={handleCancel} className="text-gray-400">Cancel</button>
      </div>
    </div>
  )
}