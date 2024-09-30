'use client'

import { useState, ChangeEventHandler } from "react"

import { NavTile } from "@/components/tile"
import HTML from "@/components/html"
import Race from "@/components/race"
import NextStep from "@/components/nextStep"

import { useRaceDayStore } from "@/stores/raceDayStore"
import { RaceDay } from "@/models/raceday"

import { capitalize, toId } from "@/lib/string"
import { useRouter } from "next/navigation"

import styles from "./page.module.css"

type ModalConfig = {
  fleet?: FleetSchema,
  count: number
} | undefined

export default function Home() {
  const [racers, races, config, volunteers] = useRaceDayStore(s=>[s.racers, s.races, s.config, s.volunteers])

  const raceDay = new RaceDay(racers, races, config)

  const [modalConfig, setModalConfig] = useState<ModalConfig>()

  const onCancelModal = () => setModalConfig(undefined)

  return (
    <>
      <main className="m-2 mt-44 rounded overflow-hidden">

        {/* Shows the races once configuration is done. Otherwise shows configuration setup */}
        <section className="bg-white rounded">
          {/* Banner communicating what the next steps are */}
          <NextStep />

          { raceDay.canRace()
            // Show START RACE / CURRENT RACE and past races
            ? <RacesPartial {...{raceDay}} onStartRace={setModalConfig} />

            // Or only show the SETUP tiles if racing can't yet be started
            : <SetupPartial {...{raceDay, volunteers}} />
          }
        </section>
        
        {/* Config settings, only shown once racing can start */}
        <section className="bg-clear-100 mt-4 rounded">
          { raceDay.canRace() && <SetupPartial {...{raceDay, volunteers}} /> }
        </section>
      </main>

      { modalConfig && <CourseModal {...modalConfig!} onCancel={onCancelModal} /> }
    </>
  );
}

function SetupPartial({ raceDay, volunteers }: { raceDay: RaceDay, volunteers: VolunteerSchema[]}) {
  function _AddRacers() {
    const count = raceDay._racers.length

    const subtitle = <>
      <strong>{ raceDay.racers('A').length }</strong> A fleet
      <br />
      <strong>{ raceDay.racers('B').length }</strong> B fleet
    </>

    return (
      count === 0 ? <NavTile.Todo title="+" subtitle="Add racers" href="/setup/racers" /> :
      count < 5 ? <NavTile.Highlight title="Racers" subtitle={ subtitle } href="/setup/racers" /> :
      <NavTile.Base title="Racers" subtitle={ subtitle } href="/setup/racers" />
    )
  }

  function _AddVolunteers() {
    const count = volunteers.length

    const chair = volunteers.find( v => v.role === 'Race committee' )

    return (
      count === 0 ? <NavTile.Todo title="+" subtitle="Committee volunteers" href="/setup/volunteers" /> :
      !chair ? <NavTile.Highlight title="No Chair" subtitle={`${count} volunteer${count!==1 ? 's' : ''}`} href="/setup/volunteers" /> :
      <NavTile.Base title="Chair" subtitle={`${chair.name} + ${count} other${count!==1 ? 's' : ''}`} href="/setup/volunteers" />
    )
  }

  function _Details() {
    // If there is a single fleet, then print "1 fleet". Otherwise, count
    // the number of fleets and print "0 fleets", "1 fleet", "2 fleets", etc.
    const f = raceDay.racingFleets ? raceDay.racingFleets.length : 0
    const title = raceDay.raceSeparateFleets
    ? `${f} fleet${ f===1 ? '' : 's'}`
    : '1 fleet'

    return (
      raceDay._config.hasSaved
      ? <NavTile.Base
          title={ title }
          subtitle={ `${ capitalize(raceDay.sailSize) } sails` }
          href="/setup/details"
        />
      : <NavTile.Todo
          title="+"
          subtitle="Race details"
          href="/setup/details"
        />
    )
  }

  return (
    <div className="p-4 col-2">
      <HTML.H1>Setup</HTML.H1>

      <div className="row-wrap-2">
        <_AddRacers />

        <_AddVolunteers />

        <_Details />

        <NavTile.Base
          title="Reset"
          subtitle="Clear data"
          href="/setup/reset"
        />
      </div>
    </div>
  )
}

function RacesPartial({raceDay, onStartRace}:
  {raceDay: RaceDay, onStartRace: (config:ModalConfig)=>void}) {

  // Decide if scores should be shown
  const showScores = raceDay.racingFleets && raceDay.racingFleets
    // Get the array of finished races for each fleet...
    .map( fleet => raceDay.finishedRaces(fleet).length )
    // ...then make sure each fleet has at least 1 finished race
    .reduce( (agg, c) => agg && c>0, true )
  
  return (
    <div className="p-2">
      <CurrentRacesPartial {...{raceDay, onStartRace}} />
      { showScores ? <ViewScoresButton /> : <div className="h-2" /> }
      <FinishedRacesPartial {...{raceDay}} />
    </div>
  )
}

function CurrentRacesPartial({ raceDay, onStartRace }: {raceDay:RaceDay, onStartRace:(c:ModalConfig)=>void}) {
  const fleets: (FleetSchema | undefined)[] = raceDay.racingFleets || []
  const cols = 'grid-cols-' + fleets.length
  const className = `gap-2 grid ${ cols }`

  let currentRaces = new Map<FleetSchema|undefined, RaceSchema|undefined>()
  fleets.forEach( fleet => currentRaces.set(fleet, raceDay.unfinishedRaces(fleet)[0]) )

  return (
    <div className={className}>
      {
        fleets.map( (fleet, i) => (
          currentRaces.get(fleet)
          ? <Race.Running race={ currentRaces.get(fleet)! } key={i} />
          : <NextRaceButton {...{fleet, raceDay, onStartRace}} key={i} />
        ))
      }
    </div>
  )
}

function NextRaceButton({fleet, raceDay, onStartRace}:
  {fleet:FleetSchema|undefined, raceDay:RaceDay, onStartRace:(c:ModalConfig)=>void}
) {
  const nextRaceCount = raceDay.races(fleet).length + 1

  return (
    <button
      className="block flex flex-col items-stretch p-4 text-white bg-ocean-400 hover:bg-ocean-500"
      onClick={ () => onStartRace({fleet, count: nextRaceCount}) }
    >
      <HTML.H1>New { fleet } race</HTML.H1>
      <HTML.Small>Start race #{ nextRaceCount }</HTML.Small>
    </button>
  )
}

function ViewScoresButton() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/scores')
  }

  return (
    <button className="w-full text-center py-4 text-ocean-500" onClick={ handleClick }>
      <small>View scores for the day</small>
    </button>
  )
}

function FinishedRacesPartial({raceDay}: {raceDay: RaceDay}) {
  const fleets: (FleetSchema | undefined)[] = raceDay.racingFleets || []
  const cols = 'grid-cols-'+fleets.length
  const className = `gap-2 grid ${ cols }`

  let finishedRaces = new Map<FleetSchema|undefined, RaceSchema[]>()
  fleets.forEach( fleet => finishedRaces.set(fleet, raceDay.finishedRaces(fleet)) )

  return (
    <div className={className}>
      {
        fleets.map( (fleet, i) => (
          <div className="col-2" key={i}>
            { finishedRaces.get(fleet)!.map( r => <Race.View race={r} key={r.id} /> ) }
          </div>
        ))
      }
    </div>
  )
}

function CourseModal({fleet, count, onCancel}:
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
    // setCourse( courseSchema.parse(e.target.value) )
    setCourse(e.target.value as CourseSchema)
  }

  return (
    <div className="p-4 col-4 absolute inset-0 bg-white">
      <HTML.Header>
        <HTML.Back onClick={ onCancel }>
          Race {count} {fleet && `- ${fleet} fleet`}
        </HTML.Back>
      </HTML.Header>
      
      <div className="grid grid-cols-3 gap-2">
        { imgs.map( ([img, title],i) => (
            <div className={ styles.RadioTile } key={i}>
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

      <Race.Start fleet={fleet} course={course!} count={count} disabled={ !course } />
    </div>
  )
}