'use client'

import { useState, ChangeEventHandler } from "react"

import { NavTile } from "@/components/tile"
import HTML from "@/components/html"
import Race from "@/components/race"
import NextStep from "@/components/nextStep"

import { useRaceStore } from "@/stores/raceStore"
import { useRacerStore } from "@/stores/racerStore"
import { useDetailsStore } from "@/stores/detailsStore"
import { RaceDay } from "@/models/raceday"

import { capitalize, toId } from "@/lib/string"

type ModalConfig = {
  fleet: FleetSchema,
  count: number
} | undefined

export default function Home() {
  const racers = useRacerStore(s=>s.racers)
  const races = useRaceStore(s=>s.races)
  const config = useDetailsStore(s=>s.config)

  const raceDay = new RaceDay(racers, races, config)

  const [modalConfig, setModalConfig] = useState<ModalConfig>()

  const onCancelModal = () => setModalConfig(undefined)

  return (
    <>
      <main>
        <img src="/MFA_splash.png" />

        {/* Banner communicating what the next steps are */}
        <NextStep />

        {/* Shows the races once configuration is done. Otherwise shows configuration setup */}
        <section className="bg-white p-4">
          { raceDay.canRace()
            // Print the races that have happened already
            ?  <div className={ `gap-2 grid grid-cols-${ raceDay.fleets.length }`}>
                {raceDay.fleets.map( (fleet,i) =>
                  (<FleetRacesPartial {...{fleet, raceDay, onStartRace: setModalConfig}} key={i} />) )
                }
              </div>

            // Or only show the SETUP tiles if racing can't yet be started
            : <SetupPartial {...{raceDay}} />
          }
        </section>
        
        {/* Config settings, only shown once racing can start */}
        <section className="bg-gray-100 px-4">
          { raceDay.canRace() && <SetupPartial {...{raceDay}} /> }
        </section>
      </main>

      { modalConfig && <CourseModal {...modalConfig!} onCancel={onCancelModal} /> }
    </>
  );
}

function SetupPartial({ raceDay }: { raceDay: RaceDay}) {
  const config = useDetailsStore(s=>s.config)
  const racers = useRacerStore(s=>s.racers)

  function _AddRacers() {
    const count = raceDay._racers.length

    const subtitle = <>
      <strong>{ racers.filter(r=>r.fleet==='A').length }</strong> A fleet
      <br />
      <strong>{ racers.filter(r=>r.fleet==='B').length }</strong> B fleet
    </>

    return count === 0
    ? <NavTile
        title="+"
        subtitle="Add racers"
        href="/racers"
        className="border border-dashed border-gray-300 text-gray-400"
      />
    : <NavTile
        title="Racers"
        subtitle={ subtitle }
        href="/racers"
        className={ count < 5 ? "bg-yellow-100" : "bg-sky-50"}
      />
  }

  function _Details() {
    return (
      config.hasSaved
      ? <NavTile
          title={ config.fleets.length === 1 ? '1 fleet' : '2 fleets' }
          subtitle={ `${ capitalize(config.sailSize) } sails` }
          href="/details"
        />
      : <NavTile
          title="+"
          subtitle="Race details"
          href="/details"
          className="TileTodo"
        />
    )
  }

  return (
    <div className="py-4 col-2">
      <HTML.h1>Setup</HTML.h1>

      <div className="row-2">
        <_AddRacers />

        <_Details />

        <NavTile
          title="Reset"
          subtitle="Clear data"
          href="/reset"
        />
      </div>
    </div>
  )
}

/**
 * Partial for displaying a fleet's races, and the option CTA to start a new race
 */
function FleetRacesPartial({fleet, raceDay, onStartRace}:
  {fleet: FleetSchema, raceDay: RaceDay, onStartRace: (c:ModalConfig)=>void}) {
  const unfinishedRaces = raceDay.unfinishedRaces( fleet )
  const finishedRaces = raceDay.finishedRaces( fleet )

  const nextRaceCount = raceDay.races(fleet).length + 1

  return (
    <div className="col-2">
      {/* Either the current race, or the CTA to start a race */}
      <div className="col-2">
        {
          unfinishedRaces.length
          ? <Race.run race={unfinishedRaces[0]} />
          : <button
              className="block flex flex-col items-stretch p-4 text-white bg-ocean-400 hover:bg-ocean-500"
              onClick={ () => onStartRace({fleet, count: nextRaceCount}) }
            >
              <HTML.h1>New { fleet } race</HTML.h1>
              <HTML.small>Start race #{ nextRaceCount }</HTML.small>
            </button>
        }
      </div>

      {/* All of the finished races */}
      <div className="col-2">
        { finishedRaces.reverse().map( r => <Race.show race={r} key={r.id} /> )}
      </div>
    </div>
  )
}

function CourseModal({fleet, count, onCancel}:
  {fleet:FleetSchema, count:number, onCancel: ()=>void}) {
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
    // setCourse( courseSchema.parse(e.target.value) )
    setCourse(e.target.value as CourseSchema)
  }

  return (
    <div className="p-4 col-4 absolute inset-0 bg-white">
      <header className="row-2">
        <HTML.back onClick={ onCancel } />
        Race {count} - {fleet} fleet
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

      <Race.start fleet={fleet} course={course} count={count} disabled={ !course } />
    </div>
  )
}