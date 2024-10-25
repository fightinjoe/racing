'use client'

import { useState } from "react"
import { useRaceDayStore } from "@/stores/raceDayStore"
import { useRacerSort } from "@/lib/useRacerSort"

import AddRacer from "./_add"
import Tile from "@/components/tile"
import HTML from "@/components/html"
import Button from "@/components/button"
import { ModalTile } from "@/components/tile"
import useModalTray from "@/components/useModalTray"

import styles from './page.module.css'

export default function RacersPage() {
  const [racers, addRacer, editRacer, deleteRacer] =
    useRaceDayStore(s => [s.racers, s.addRacer, s.editRacer, s.deleteRacer])

  const {Tabs, helpSortRacers} = useRacerSort()

  const modal = useModalTray({
    doForce: () => racers.length === 0,
    onCancel: () => setRacerToEdit(null),
  })

  // Show the form by default when there are no racers
  // const [showAddForm, setShowAddForm] = useState( racers.length === 0 )
  const [racerToEdit, setRacerToEdit] = useState<RacerSchema | null>(null)

  const onSave = (data: RacerFormSchema) => {
    racerToEdit
    ? editRacer(racerToEdit, data)
    : addRacer(data.name, data.sailNumber, data.fleet)
    
    setRacerToEdit(null)
  }

  const onEditHandler = (racer: RacerSchema) => {
    return () => {
      setRacerToEdit(racer)
      modal.show()
    }
  }

  return (
    <main className="h-full col-0 relative">
      <HTML.BackHeader title="Racers">
        <button className="button-header" onClick={() => modal.show(true)}>
          {modal.visible ? '' : 'Add' }
        </button>
      </HTML.BackHeader>

      <modal.Tray classNames={ racerToEdit ? '!bg-yellow-100' : ''}>
        <AddRacer racer={racerToEdit} {...{onSave, onCancel: modal.hide}} />
      </modal.Tray>

      <section className="p-4 pb-0 col-4 shadow-inner shrink overflow-y-hidden">
        <Tabs darkMode={true} />

        <div className="row-wrap-2 pb-4 overflow-scroll">
          {
            racers.length === 0 &&
            <Tile className="tile-todo" title="+" subtitle="Add racer" onClick={ modal.show } />
          }
          {
            racers.sort( helpSortRacers ).map( (racer,i) => (
              <ModalTile
                key={i}
                sailor={racer}
                className={racerToEdit && racer.id === racerToEdit.id ? 'bg-yellow-100' : 'bg-ocean-200'}
              >
                <div className="col-0 gap-[1px]">
                  <Button.Primary
                    onClick={ onEditHandler(racer) }
                    className={ styles.editButton }
                  >
                    Edit
                  </Button.Primary>
                  
                  <Button.Secondary
                    onClick={ () => confirm('Do you want to permanently delete this racer?') && deleteRacer(racer) }
                  >
                    Delete
                  </Button.Secondary>
                </div>
              </ModalTile>
            ))
          }
        </div>

      </section>
    </main>
  )
}