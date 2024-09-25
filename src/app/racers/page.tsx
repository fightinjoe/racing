'use client'

import { useState } from "react"
import { useRaceDayStore } from "@/stores/raceDayStore"
import { useRacerSort } from "@/lib/useRacerSort"

import AddPartial from "./_add"
import type { RacerFormData } from "./_add"
import HTML from "@/components/html"
import { ModalTile } from "@/components/tile"

export default function RacersPage() {
  const [racers, addRacer, editRacer, deleteRacer] =
    useRaceDayStore(s => [s.racers, s.addRacer, s.editRacer, s.deleteRacer])

  const {Tabs, helpSortRacers} = useRacerSort()

  const [racerToEdit, setRacerToEdit] = useState<RacerSchema | null>(null)

  const onSave = (data: RacerFormData) => {
    racerToEdit
    ? editRacer(racerToEdit, data)
    : addRacer(data.name, data.sailNumber, data.fleet)
    
    setRacerToEdit(null)
  }

  const onCancel = () => {
    setRacerToEdit(null)
  }

  return (
    <main>
      <header className="p-4 row-2">
        <HTML.Back>
          <HTML.H1>Racers</HTML.H1>
        </HTML.Back>
      </header>

      <section className="bg-white p-4">
        <AddPartial racer={racerToEdit} {...{onSave, onCancel}} />
      </section>

      <section className="p-4 col-4 bg-gray-100 shadow-inner">
        { racers.length > 0 && <Tabs /> }

        <div className="row-wrap-2">{
          racers.sort( helpSortRacers ).map( (racer,i) => (
            <ModalTile key={i} racer={racer}>
              <div className="col-0 gap-[1px] bg-gray-300">
                <button
                  className="ContextMenuPrimary"
                  onClick={ () => setRacerToEdit(racer) }
                >
                  Edit
                </button>
                
                <button
                  className="ContextMenuSecondary"
                  onClick={ () => deleteRacer(racer) }
                >
                  Delete
                </button>
              </div>
            </ModalTile>
          ))
        }</div>
      </section>
    </main>
  )
}