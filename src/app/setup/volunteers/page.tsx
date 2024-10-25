'use client'

import { useState } from "react"
import { useRaceDayStore } from "@/stores/raceDayStore"

import AddVolunteer from "./_add"
import HTML from "@/components/html"
import Button from "@/components/button"
import Tile from "@/components/tile"
import { ModalTile } from "@/components/tile"
import useModalTray from "@/components/useModalTray"

export default function VolunteersPage() {
  const [volunteers, addVolunteer, editVolunteer, deleteVolunteer] =
    useRaceDayStore(s => [s.volunteers, s.addVolunteer, s.editVolunteer, s.deleteVolunteer])

  const rcVolunteers = volunteers.filter( v => v.role === 'Race committee' || v.role === 'Volunteer' )
  const cbVolunteers = volunteers.filter( v => v.role === 'Crash boat' )

  const [volunteerToEdit, setVolunteerToEdit] = useState<VolunteerSchema | null>(null)

  const modal = useModalTray({
    doForce: () => volunteers.length === 0,
    onCancel: () => setVolunteerToEdit(null),
  })

  const onSave = (data: VolunteerFormSchema) => {
    volunteerToEdit
    ? editVolunteer(volunteerToEdit, data)
    : addVolunteer(data.name, data.role)
    
    setVolunteerToEdit(null)
  }

  const Volunteer = ({volunteer, key}: {volunteer: VolunteerSchema, key: any}) => (
    <ModalTile
      key={key}
      sailor={volunteer}
      className={volunteerToEdit && volunteer.id === volunteerToEdit.id ? 'bg-yellow-100' : 'bg-ocean-200'}
    >
      <div className="col-0 gap-[1px] bg-gray-300">
        <Button.Primary onClick={ () => setVolunteerToEdit(volunteer) }>
          Edit
        </Button.Primary>
        
        <Button.Secondary
          onClick={ () => confirm('Do you want to permanently delete this racer?') && deleteVolunteer(volunteer) }
        >
          Delete
        </Button.Secondary>
      </div>
    </ModalTile>
  )

  return (
    <main className="h-full col-0 relative">
      <HTML.BackHeader title="Volunteers">
        <button className="button-header" onClick={() => modal.show(true)}>
          {modal.visible ? '' : 'Add' }
        </button>
      </HTML.BackHeader>

      <modal.Tray classNames={ volunteerToEdit ? '!bg-yellow-100' : ''}>
        <AddVolunteer volunteer={volunteerToEdit} {...{onSave, onCancel: modal.hide}} />
      </modal.Tray>

      <section className="p-4 col-4 shadow-inner overflow-scroll">
        <HTML.H2>Race committee</HTML.H2>
        <div className="row-wrap-2 overflow-scroll">
          {
            rcVolunteers.length === 0
            ? <Tile className="tile-todo" title="+" subtitle="Add race committee" onClick={ modal.show } />
            : rcVolunteers.map( (volunteer,key) => <Volunteer {...{volunteer, key}} /> )
          }
        </div>

        <HTML.H2>Crash boat</HTML.H2>
        <div className="row-wrap-2 overflow-scroll">
          {
            cbVolunteers.length === 0
            ? <Tile className="tile-todo" title="+" subtitle="Add crash boat" onClick={ modal.show } />
            : cbVolunteers.map( (volunteer,key) => <Volunteer {...{volunteer, key}} /> )
          }
        </div>
      </section>
    </main>
  )
}