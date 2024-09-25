'use client'

import { useState } from "react"
import { useRaceDayStore } from "@/stores/raceDayStore"
import { useRacerSort } from "@/lib/useRacerSort"

import AddPartial from "./_add"
import HTML from "@/components/html"
import { ModalTile } from "@/components/tile"

export default function RacersPage() {
  const [racers, addRacer, editRacer, deleteRacer] =
    useRaceDayStore(s => [s.racers, s.addRacer, s.editRacer, s.deleteRacer])

  const {Tabs, helpSortRacers} = useRacerSort()

  const [racerToEdit, setRacerToEdit] = useState<RacerSchema | null>(null)

  const onSave = (data: RacerFormSchema) => {
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
      <HTML.Header>
        <HTML.Back>Racers</HTML.Back>
      </HTML.Header>

      <section className={`p-4 ${racerToEdit ? 'bg-yellow-100' : 'bg-white'}`}>
        <AddPartial racer={racerToEdit} {...{onSave, onCancel}} />
      </section>

      <section className="p-4 col-4 shadow-inner">
        { racers.length > 0 && <Tabs darkMode={true} /> }

        <div className="row-wrap-2">{
          racers.sort( helpSortRacers ).map( (racer,i) => (
            <ModalTile
              key={i}
              racer={racer}
              className={racerToEdit && racer.id === racerToEdit.id ? 'bg-yellow-100' : 'bg-ocean-200'}
            >
              <div className="col-0 gap-[1px] bg-gray-300">
                <button
                  className="ContextMenuPrimary"
                  onClick={ () => setRacerToEdit(racer) }
                >
                  Edit
                </button>
                
                <button
                  className="ContextMenuSecondary"
                  onClick={ () => confirm('Do you want to permanently delete this racer?') && deleteRacer(racer) }
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