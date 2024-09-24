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

type ModalConfig = {
  fleet?: FleetSchema,
  count: number
} | undefined

export default function Home() {
  const [racers, races, config] = useRaceDayStore(s=>[s.racers, s.races, s.config])

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
            // Show START RACE / CURRENT RACE and past races
            ? <RacesPartial {...{raceDay}} onStartRace={setModalConfig} />

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
  function _AddRacers() {
    const count = raceDay._racers.length

    const subtitle = <>
      <strong>{ raceDay.racers('A').length }</strong> A fleet
      <br />
      <strong>{ raceDay.racers('B').length }</strong> B fleet
    </>

    return count === 0
    ? <NavTile
        title="+"
        subtitle="Add racers"
        href="/racers"
        className="TileTodo"
      />
    : <NavTile
        title="Racers"
        subtitle={ subtitle }
        href="/racers"
        className={ count < 5 ? "bg-yellow-100" : "bg-sky-50"}
      />
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
      ? <NavTile
          title={ title }
          subtitle={ `${ capitalize(raceDay.sailSize) } sails` }
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

function RacesPartial({raceDay, onStartRace}:
  {raceDay: RaceDay, onStartRace: (config:ModalConfig)=>void}) {
  return (
    <>
      <CurrentRacesPartial {...{raceDay, onStartRace}} />
      { raceDay.finishedRaces().length ? <ViewScoresButton /> : null }
      <FinishedRacesPartial {...{raceDay}} />
    </>
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
          ? <Race.run race={ currentRaces.get(fleet)! } key={i} />
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
      <HTML.h1>New { fleet } race</HTML.h1>
      <HTML.small>Start race #{ nextRaceCount }</HTML.small>
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
            { finishedRaces.get(fleet)!.map( r => <Race.show race={r} key={r.id} /> ) }
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
      <header className="row-2">
        <HTML.back onClick={ onCancel } />
        Race {count} {fleet && `- ${fleet} fleet`}
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

      <Race.start fleet={fleet} course={course!} count={count} disabled={ !course } />
    </div>
  )
}