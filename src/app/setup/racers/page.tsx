'use client'

import { useState } from "react"
import { useRaceDayStore } from "@/stores/raceDayStore"
import { useRosterStore } from "@/stores/rosterStore"
import { useRacerSort } from "@/components/useRacerSort"

import AddRacer from "./_add"
import Tile, {TileBadge} from "@/components/tile"
import type { DefaultTileProps } from "@/components/tile"
import HTML from "@/components/html"
import Button from "@/components/button"
import { ModalTile, RacerTile } from "@/components/tile"
import useModalTray from "@/components/useModalTray"

import styles from './page.module.css'

export default function RacersPage() {
  const [racers, addRacer, editRacer, deleteRacer, racerRegistered] =
    useRaceDayStore(s => [s.racers, s.addRacer, s.editRacer, s.deleteRacer, s.racerRegistered])

  const racerLookup = new Map(racers.map(r => [r.name, r]))

  const [roster, fetchRoster] = useRosterStore(s => [s.roster, s.fetchRoster])

  const {Tabs, helpSortRacers} = useRacerSort({sorts: ['name', 'number', 'fleet']})

  const modal = useModalTray({})
  
  // Show the form by default when there are no racers
  const [racerToEdit, setRacerToEdit] = useState<RacerSchema | null>(null)

  const onSave = (data: RacerFormSchema) => {
    racerToEdit && racerRegistered(racerToEdit)
    ? editRacer(racerToEdit, data)
    : addRacer(data.name, data.sailNumber, data.fleet)
    
    setRacerToEdit(null)
  }

  const onCancel = () => {
    setRacerToEdit(null)
    modal.props.hide()
  }

  const onEditHandler = (racer: RacerSchema) => {
    return () => {
      setRacerToEdit(racer)
    }
  }

  const _RosterModalOptions = ({sailor}:{sailor: SailorSchema}) => (
    <div className="col-0 gap-[1px]">
      {
        sailor.suggestedSailNumbers?.map( (sailNumber, i) => (
          <Button.Primary
            key={i}
            onClick={ () => addRacer(sailor.name, sailNumber, sailor.suggestedFleet!) }
            className="!bg-white !text-ocean-800"
          >
            {sailNumber} ({sailor.suggestedFleet})
          </Button.Primary>
        ))
      }

      <Button.Secondary
        onClick={ onEditHandler({...sailor, fleet: sailor.suggestedFleet!} as RacerSchema) }
        className="!bg-teal-300 !text-ocean-800"
      >
        Customize
      </Button.Secondary>
    </div>
  )

  const _RacerModalOptions = ({racer}:{racer: RacerSchema}) => (
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
        Remove
      </Button.Secondary>
    </div>
  )

  const _AddRacerTile = () => (
    <Tile
      className="tile-todo"
      title="+"
      subtitle="Add racer"
      onClick={ () => modal.props.show() }
    />
  )

  function inferRacer(sailor: SailorSchema) {
    return {
      ...sailor,
      role: 'Racer',
      isGuest: false,
      sailNumber: sailor.suggestedSailNumbers?.[0] || '?',
      fleet: sailor.suggestedFleet as FleetSchema
    } as RacerSchema
  }

  return (
    <main className="h-full col-0 relative">
      <HTML.BackHeader title={ `${racers.length} Racer${racers.length === 1 ? '' : 's'}` }>
        <button className="button-header" onClick={() => fetchRoster()}>
          {modal.props.visible ? '' : 'Load roster' }
        </button>
      </HTML.BackHeader>

      {/* ADD RACER modal. May be triggered from the header or a tile */}
      <modal.Tray
        {...modal.props}
        visible={ modal.props.visible || !!racerToEdit }
        className={ !!racerRegistered(racerToEdit) ? '!bg-yellow-100' : ''}
      >
        <AddRacer racer={racerToEdit} {...{onSave, onCancel}} />
      </modal.Tray>

      <section className="py-4 pb-0 col-4 shadow-inner shrink overflow-y-hidden">
        {/* Sorting tabs */}
        <div className="px-4"><Tabs darkMode={true} /></div>

        {/* Racers */}
        <div className="row-wrap-2 px-4 pt-2 pb-4 overflow-scroll">
          <_AddRacerTile />

          {
            roster
            .map( inferRacer )
            .sort(helpSortRacers)
            .map( (member, i) => {
              const isRegistered = racerLookup.has(member.name)
              
              let sailor: RacerSchema = isRegistered
              ? racerLookup.get(member.name)!
              : {
                ...member,
                role: 'Racer',
                isGuest: false,
                sailNumber: member.suggestedSailNumbers?.[0] || '?',
                fleet: member.suggestedFleet as FleetSchema
              }

              let className = isRegistered ? 'bg-ocean-200' : 'tile-todo !bg-clear-100'

              let TileRenderer: React.FC<DefaultTileProps<RacerSchema>> =
                isRegistered ? RegisteredRacer : UnregisteredSailor

              return (
                <ModalTile<RacerSchema> key={i} {...{sailor, className, TileRenderer}}>
                  { isRegistered
                    ? <_RacerModalOptions racer={sailor} />
                    : <_RosterModalOptions sailor={member} /> }
                </ModalTile>
              )
            })
          }
        </div>

      </section>
    </main>
  )
}

const RegisteredRacer = ({sailor, onClick}: DefaultTileProps) => (
  <Tile
    title={sailor.sailNumber}
    subtitle={sailor.name}
    className="mb-1 bg-ocean-200"
    onClick={onClick}
  >
    <TileBadge
      text={sailor.fleet}
      className={ `text-white ${sailor.fleet === 'A' ? 'bg-ocean-800' : 'bg-ocean-400'}` }
    />
  </Tile>
)

const UnregisteredSailor = ({sailor, onClick}: DefaultTileProps) => (
  <Tile
    title={sailor.sailNumber}
    subtitle={sailor.name}
    className="mb-1 tile-todo"
    onClick={onClick}
  />
)