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
      <main className={ `${styles.main} h-full` }>
        <HTML.Header className={ styles.header }>
          <img src="/imgs/logo-snowflake.png" alt="MFA logo" />
          <h1>MFA Racing</h1>
        </HTML.Header>

        <RacesPartial {...{raceDay}} onStartRace={setModalConfig} />

        <SetupPartial {...{raceDay, volunteers}} />
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

    if (raceDay.canRace()) return (
      <NavTile.Done
        title="Racers"
        subtitle={ subtitle }
        href="/setup/racers"
      />
    )

    if (count === 0) return (
      <NavTile.Base
        title="+"
        subtitle="Add racers"
        href="/setup/racers"
        className="tile-todo"
      />
    )

    if (count < 5) return (
      <NavTile.Highlight
        title="Racers"
        subtitle={ subtitle }
        href="/setup/racers"
      />
    )

    return (
      <NavTile.Base
        title="Racers"
        subtitle={ subtitle }
        href="/setup/racers"
      />
    )
  }

  function _AddVolunteers() {
    const count = volunteers.length

    const chair = volunteers.find( v => v.role === 'Race committee' )

    // If we can race, then all of the setup is complete
    if(raceDay.canRace()) return (
      <NavTile.Done
        title="Chair"
        subtitle={`${chair!.name} + ${count} other${count!==1 ? 's' : ''}`}
        href="/setup/volunteers" />
    )

    // If there are no volunteers, then print the TODO tile
    if(count === 0) return (
      <NavTile.Base
        title="+"
        subtitle="Committee volunteers"
        href="/setup/volunteers"
        className="tile-todo" />
    )

    // If there is no RC chair but there are volunteers, then highlight 
    if(!chair) return (
      <NavTile.Highlight
        title="No Chair"
        subtitle={`${count} volunteer${count!==1 ? 's' : ''}`}
        href="/setup/volunteers" />
    )

    return (
      <NavTile.Base
        title="Chair"
        subtitle={`${chair.name} + ${count} other${count!==1 ? 's' : ''}`}
        href="/setup/volunteers" />
    )
  }

  function _Details() {
    // If there is a single fleet, then print "1 fleet". Otherwise, count
    // the number of fleets and print "0 fleets", "1 fleet", "2 fleets", etc.
    const f = raceDay.racingFleets ? raceDay.racingFleets.length : 0
    const title = raceDay.raceSeparateFleets
    ? `${f} fleet${ f===1 ? '' : 's'}`
    : '1 fleet'

    const subtitle = `${ capitalize(raceDay.sailSize) } sails`

    const href = "/setup/details"
    
    if (raceDay.canRace()) return (
      <NavTile.Done
        title={ title }
        subtitle={ subtitle }
        href={href}
      />
    )

    if (raceDay._config.hasSaved) return (
      <NavTile.Base
        title={ title }
        subtitle={ subtitle }
        href={href}
      />
    )

    return <NavTile.Base
      title="+"
      subtitle="Race details"
      href={href}
      className="tile-todo"
    />
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

          {/* <NavTile.Base
            title="Reset"
            subtitle="Clear data"
            href="/setup/reset"
          /> */}
        </div>
      </div>
    </section>
  )
}

interface RacesPartialProps {
  raceDay: RaceDay,
  onStartRace: (config:ModalConfig)=>void
}

/** Displays the current and finished races.
 *  Will print nothing if raceDay.canRace() is false
 */
function RacesPartial({raceDay, onStartRace}: RacesPartialProps) {
  if (!raceDay.canRace()) return null

  return (
    <>
      <CurrentRacesPartial {...{raceDay, onStartRace}} />

      <FinishedRacesPartial {...{raceDay}} />
    </>
  )
}

/** Main section showing either the START RACE button or the currently
 *  running race for each fleet
 */
function CurrentRacesPartial({ raceDay, onStartRace }: {raceDay:RaceDay, onStartRace:(c:ModalConfig)=>void}) {
  const fleets: (FleetSchema | undefined)[] = raceDay.racingFleets || []
  const cols = 'grid-cols-' + fleets.length
  const className = `gap-2 grid ${ cols }`

  let currentRaces = new Map<FleetSchema|undefined, RaceSchema|undefined>()
  fleets.forEach( fleet => currentRaces.set(fleet, raceDay.unfinishedRaces(fleet)[0]) )

  // Decide if scores should be shown
  const showScores = raceDay.racingFleets && raceDay.racingFleets
    // Get the array of finished races for each fleet...
    .map( fleet => raceDay.finishedRaces(fleet).length )
    // ...then make sure each fleet has at least 1 finished race
    .reduce( (agg, c) => agg && c>0, true )

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
          : <StartRaceButton {...{fleet, raceDay, onStartRace}} key={i} />
        ))
      }
    </div>
    </section>
  )
}

/** Button for starting a new race */
function StartRaceButton({fleet, raceDay, onStartRace}:
  {fleet:FleetSchema|undefined, raceDay:RaceDay, onStartRace:(c:ModalConfig)=>void}
) {
  const nextRaceCount = raceDay.races(fleet).length + 1

  return (
    <button
      className={ styles.startRace }
      onClick={ () => onStartRace({fleet, count: nextRaceCount}) }
    >
      <HTML.H1>Start race  { `${nextRaceCount}${fleet}` }</HTML.H1>
      <HTML.Small>{fleet} fleet</HTML.Small>
    </button>
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
    <div className="col-4 absolute inset-0 bg-ocean-radial">
      <HTML.BackHeader onClick={ onCancel }>
        Race {count} {fleet && `- ${fleet} fleet`}
      </HTML.BackHeader>
      
      <div className="bg-white mx-2 p-2 rounded col-2">
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

        <Race.Start fleet={fleet} course={course!} count={count} disabled={ !course } />
      </div>
    </div>
  )
}