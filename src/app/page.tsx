'use client'

import { useRef, useState, ChangeEventHandler } from "react"

import { NavTile } from "@/components/tile"
import HTML from "@/components/html"
import Race from "@/components/race"
// import NextStep from "@/components/nextStep"
import { useNextSteps } from "@/lib/useNextSteps"

import { useRaceDayStore } from "@/stores/raceDayStore"
import { RaceDay } from "@/models/raceday"

import { capitalize, toId } from "@/lib/string"
import { useRouter } from "next/navigation"

import styles from "./page.module.css"
import modalStyles from "@/components/tile.module.css"
import { title } from "process"

type ModalConfig = {
  fleet?: FleetSchema,
  count: number
} | undefined

export default function Home() {
  const [racers, races, config, volunteers, conditions] =
    useRaceDayStore(s=>[s.racers, s.races, s.config, s.volunteers, s.conditions])

  const raceDay = new RaceDay(racers, races, config)

  return (
    <>
      <main className={ `${styles.main} h-full` }>
        <HTML.Header className={ styles.header }>
          <img src="/imgs/logo-snowflake.png" alt="MFA logo" />
          <h1>MFA Racing</h1>
        </HTML.Header>

        <RacesPartial {...{raceDay}} />

        <SetupPartial {...{raceDay, volunteers, conditions}} />
      </main>
    </>
  );
}

function SetupPartial({ raceDay, volunteers, conditions }: { raceDay: RaceDay, volunteers: VolunteerSchema[], conditions: ConditionsSchema}) {
  const { state, NextStep } = useNextSteps()

  function _AddRacers() {
    const count = raceDay._racers.length

    const subtitle = <>
      <strong>{ raceDay.racers('A').length }</strong> A fleet
      <br />
      <strong>{ raceDay.racers('B').length }</strong> B fleet
    </>

    const className = 
      state === 'Ready'             ? "tile-done" :
      state === 'Not enough racers' ? "tile-emphasize" :
      state === 'No racers'         ? "tile-emphasize" :
                                      "tile"

    const props = {
      href: "/setup/racers",
      title: state === 'No racers' ? '+' : 'Racers',
      subtitle: state === 'No racers' ? 'Add racers' : subtitle,
      className
    }

    return <NavTile.Base {...props} />
  }

  function _AddVolunteers() {
    const count = volunteers.length

    const chair = volunteers.find( v => v.role === 'Race committee' )

    const className =
      state === 'Ready' ? "tile-done" :
      state === 'No RC' ? "tile-emphasize" :
      count === 0       ? "tile-todo" :
                          "tile"

    const props = {
      href: "/setup/volunteers",
      title: chair ? 'RC' : '+',
      subtitle: chair
        ? `${chair!.name} + ${count} other${count===1?'':'s'}`
        : 'Add volunteers',
      className
    }

    return <NavTile.Base {...props} />
  }

  function _Conditions() {
    const tempMin = conditions.temperatureMin
    const tempMax = conditions.temperatureMax
    const windMin = conditions.windSpeed
    const windMax = conditions.gustSpeed

    const href = "/setup/conditions"

    const className = 
      !tempMin          ? "tile-todo" :
      state === 'Ready' ? "tile-done" :
                          "tile"

    return tempMin
    ? <NavTile.Base title={ `${tempMin} - ${tempMax}°F` } subtitle={ `${windMin} - ${windMax}kts` } href={href} className={ className } />
    : <NavTile.Base title="+" subtitle="Weather conditions" href={href} className={ className } />
  }

  function _Details() {
    // If there is a single fleet, then print "1 fleet". Otherwise, count
    // the number of fleets and print "0 fleets", "1 fleet", "2 fleets", etc.
    const f = raceDay.racingFleets ? raceDay.racingFleets.length : 0
    const title = 
      !raceDay._config.hasSaved  ? '+' :
      raceDay.raceSeparateFleets ? `${f} fleet${ f===1 ? '' : 's'}` :
                                   '1 fleet'

    const subtitle = raceDay._config.hasSaved
      ? `${ capitalize(raceDay.sailSize) } sails`
      : 'Race details'

    const className =
      state === 'Ready'           ? "tile-done" :
      state === 'No race details' ? "tile-emphasize" :
      !raceDay._config.hasSaved   ? "tile-todo" :
                                    "tile"

    const props = {
      href: "/setup/details",
      title, subtitle, className
    }
    
    return <NavTile.Base {...props} />
  }

  return (
    <section>
      {/* Banner communicating what the next steps are */}
      <NextStep />

      <div className="p-4 col-2">
        <HTML.H2>Setup</HTML.H2>

        <div className="row-wrap-2">
          <_AddRacers />
          <_AddVolunteers />
          <_Details />
          <_Conditions />
        </div>
      </div>
    </section>
  )
}

interface RacesPartialProps {
  raceDay: RaceDay,
  
}

/** Displays the current and finished races.
 *  Will print nothing if raceDay.canRace() is false
 */
function RacesPartial({raceDay}: RacesPartialProps) {
  if (!raceDay.canRace()) return null

  return (
    <>
      <CurrentRacesPartial raceDay={raceDay} />

      <FinishedRacesPartial raceDay={raceDay} />
    </>
  )
}

/** Main section showing either the START RACE button or the currently
 *  running race for each fleet
 */
function CurrentRacesPartial({ raceDay }: {raceDay:RaceDay}) {
  const fleets: (FleetSchema | undefined)[] = raceDay.racingFleets || []
  const cols = 'grid-cols-' + fleets.length
  const className = `gap-2 grid ${ cols }`

  let currentRaces = new Map<FleetSchema|undefined, RaceSchema|undefined>()
  fleets.forEach( fleet => currentRaces.set(fleet, raceDay.unfinishedRaces(fleet)[0]) )

  // VIEW SCORES link should be shown only when each fleet has at least 1 finished race
  const showScores = raceDay.racingFleets && raceDay.racingFleets
    .map( fleet => raceDay.finishedRaces(fleet).length )
    .reduce( (agg, raceCount) => agg && raceCount>0, true )

  return (
    <section className={styles.currentRaces}>
      <div className="row-2">
        <HTML.H2 className="grow">Current race</HTML.H2>
        { showScores && <ViewScoresButton /> }
      </div>

      <div className={className}>
      {
        fleets.map( (fleet, i) => (
          currentRaces.get(fleet)
          ? <Race.Running race={ currentRaces.get(fleet)! } key={i} />
          : <StartRaceButton {...{fleet, raceDay}} key={i} />
        ))
      }
      </div>
    </section>
  )
}


interface StartRaceButtonProps {
  fleet: FleetSchema|undefined
  raceDay: RaceDay
}
/** Button for starting a new race */
function StartRaceButton({fleet, raceDay}: StartRaceButtonProps) {
  const nextRaceCount = raceDay.races(fleet).length + 1

  const dialog = useRef(null)

  // Tile onClick handler
  const onClick = () => {
    if(!dialog || !dialog.current) return
    
    const modal: HTMLDialogElement = dialog.current

    modal.style.visibility = 'hidden'

    // Make the modal appear on the screen
    modal!.showModal()

    // Position the modal
    const dims = modal.getBoundingClientRect()
    modal.style.top = `${ window.innerHeight - dims.height }px`
    modal.style.left = `${ (window.innerWidth - dims.width)/2 }px`
    modal.style.visibility = 'visible'
  }

  const onDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  const closeModal = () => {
    const modal:HTMLDialogElement = dialog!.current!
    modal.close()
  }

  return (
    <div>
      <dialog ref={dialog} onClick={ onDialogClick } className={ modalStyles.modal }>
        <CourseChooser fleet={fleet} count={nextRaceCount} onCancel={closeModal} />
      </dialog>

      <button
        className={ styles.startRace }
        onClick={ onClick }
      >
        <HTML.H1>Start race  { `${nextRaceCount}${fleet || ''}` }</HTML.H1>
        <HTML.Small>{fleet || 'Combined'} fleet</HTML.Small>
      </button>
    </div>
  )
}

function ViewScoresButton() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/scores')
  }

  return (
    <button className="text-aqua-500" onClick={ handleClick }>
      <small>View scores</small>
    </button>
  )
}

/** Main section containing all of the completed races */
function FinishedRacesPartial({raceDay}: {raceDay: RaceDay}) {
  const fleets: (FleetSchema | undefined)[] = raceDay.racingFleets || []
  const cols = 'grid-cols-'+fleets.length
  const className = `gap-2 grid ${ cols }`

  let finishedRaces = new Map<FleetSchema|undefined, RaceSchema[]>()
  fleets.forEach( fleet => finishedRaces.set(fleet, raceDay.finishedRaces(fleet)) )

  return (
    <section className="p-4 col-2">
      <HTML.H2>Finished races</HTML.H2>
      <div className={className}>
        {
          fleets.map( (fleet, i) => (
            <div className="col-2" key={i}>
              { finishedRaces.get(fleet)!.map( r => <Race.View race={r} key={r.id} /> ) }
            </div>
          ))
        }
      </div>
    </section>
  )
}

function CourseChooser({fleet, count, onCancel}:
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
    setCourse(e.target.value as CourseSchema)
  }

  const handleCancel = () => {
    onCancel()
    setCourse(undefined)
  }

  return (
    <div className="bg-white mx-2 p-2 py-4 rounded col-4 items-end max-w-[390px]">
      <HTML.H2 className="!text-black w-full">Choose course</HTML.H2>
      <div className="grid grid-cols-3 gap-2 px-2">
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

      <div className="row-4 flex-row-reverse">
        <Race.Start fleet={fleet} course={course!} count={count} disabled={ !course } />
        <button onClick={handleCancel} className="text-gray-400">Cancel</button>
      </div>
    </div>
  )
}