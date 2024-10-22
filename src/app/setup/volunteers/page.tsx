'use client'

import { useState } from "react"
import { useRaceDayStore } from "@/stores/raceDayStore"
import { useRacerSort } from "@/lib/useRacerSort"

import AddPartial from "./_add"
import HTML from "@/components/html"
import Button from "@/components/button"
import { ModalTile } from "@/components/tile"

export default function VolunteersPage() {
  const [volunteers, addVolunteer, editVolunteer, deleteVolunteer] =
    useRaceDayStore(s => [s.volunteers, s.addVolunteer, s.editVolunteer, s.deleteVolunteer])

  const [volunteerToEdit, setVolunteerToEdit] = useState<VolunteerSchema | null>(null)

  const onSave = (data: VolunteerFormSchema) => {
    volunteerToEdit
    ? editVolunteer(volunteerToEdit, data)
    : addVolunteer(data.name, data.role)
    
    setVolunteerToEdit(null)
  }

  const onCancel = () => {
    setVolunteerToEdit(null)
  }

  return (
    <main className="h-full col-0">
      <HTML.BackHeader>Volunteers</HTML.BackHeader>

      <section className={`m-2 p-2 rounded-lg ${volunteerToEdit ? 'bg-yellow-100' : 'bg-white'}`}>
        <AddPartial volunteer={volunteerToEdit} {...{onSave, onCancel}} />
      </section>

      <section className="p-4 col-4 shadow-inner overflow-scroll">
        <div className="row-wrap-2 overflow-scroll">{
          volunteers.map( (volunteer,i) => (
            <ModalTile
              key={i}
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
          ))
        }</div>
      </section>
    </main>
  )
}