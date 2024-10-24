'use client'

import { useRef, useState } from "react"
import { useRaceDayStore } from "@/stores/raceDayStore"
import { useRacerSort } from "@/lib/useRacerSort"

import AddRacer from "./_add"
import Tile from "@/components/tile"
import HTML from "@/components/html"
import Button from "@/components/button"
import { ModalTile } from "@/components/tile"

import styles from './page.module.css'

export default function RacersPage() {
  const [racers, addRacer, editRacer, deleteRacer] =
    useRaceDayStore(s => [s.racers, s.addRacer, s.editRacer, s.deleteRacer])

  const formRef = useRef<HTMLElement>(null)
  const addRef = useRef<HTMLButtonElement>(null)

  const {Tabs, helpSortRacers} = useRacerSort()

  // Show the form by default when there are no racers
  const [showAddForm, setShowAddForm] = useState( racers.length === 0 )
  const [racerToEdit, setRacerToEdit] = useState<RacerSchema | null>(null)

  const onSave = (data: RacerFormSchema) => {
    racerToEdit
    ? editRacer(racerToEdit, data)
    : addRacer(data.name, data.sailNumber, data.fleet)
    
    setRacerToEdit(null)
  }

  const handleOutsideClick = (e: MouseEvent) => {
    // Make sure that the outside click is not confused with clicking on the
    // CANCEL button
    if( e.target === addRef.current ) return

    if( racers.length > 0 && formRef.current && !formRef.current.contains(e.target as Node) ) {
      onCancel()
    }
  }

  const onAdd = (onlyAdd?: boolean) => {
    if( !onlyAdd && showAddForm ) return onCancel()
      
    console.log('add')
    setShowAddForm(true)
    document.querySelector('body')?.addEventListener('click', handleOutsideClick)
  }

  const onCancel = () => {
    console.log('cancel')
    setShowAddForm(false)
    setRacerToEdit(null)
    document.querySelector('body')?.removeEventListener('click', handleOutsideClick)
  }

  const onEditHandler = (racer: RacerSchema) => {
    return () => {
      setRacerToEdit(racer)
      onAdd()
    }
  }

  let classNames = [styles.modal]
  if( showAddForm ) classNames.push(styles.visible)
  if( racerToEdit ) classNames.push("!bg-yellow-100")

  return (
    <main className="h-full col-0 relative">
      <HTML.BackHeader title="Racers">
        <button ref={addRef} className="button-header" onClick={() => onAdd(true)}>
          {showAddForm ? '' : 'Add' }
        </button>
      </HTML.BackHeader>

      <section ref={formRef} className={ classNames.join(' ')}>
        <AddRacer racer={racerToEdit} {...{onSave, onCancel}} />
      </section>

      <section className="p-4 pb-0 col-4 shadow-inner shrink overflow-y-hidden">
        <Tabs darkMode={true} />

        <div className="row-wrap-2 pb-4 overflow-scroll">
          {
            racers.length === 0 &&
            <Tile className="tile-todo" title="+" subtitle="Add racer" onClick={onAdd} />
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