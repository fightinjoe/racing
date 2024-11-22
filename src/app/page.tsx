'use client'

import { NavTile } from "@/components/tile"
import HTML from "@/components/html"
import Race from "@/components/race"
import { StartRaceButton } from "@/components/button"
import { useNextSteps } from "@/components/useNextSteps"

import { useRaceDayStore } from "@/stores/raceDayStore"
import { RaceDay } from "@/models/raceday"

import { capitalize } from "@/lib/string"
import { useRouter } from "next/navigation"

import styles from "./page.module.css"

/**
 * This is the main dashboard for the app. What it shows depends on the state
 * of the app. First, it will prompt the user to add racers, volunteers, and
 * racing details. Once all of that is done, the user can start a race.
 */
export default function Home() {
  const [racers, races, config, volunteers, conditions] =
    useRaceDayStore(s=>[s.racers, s.races, s.config, s.volunteers, s.conditions])

  const raceDay = new RaceDay(racers, races, config)
  const router = useRouter()

  return (
    <>
      <main className={ `${styles.main} h-full flex flex-col` }>
        <HTML.Header className={ styles.header }>
          <img src="/imgs/logo-snowflake.png" alt="MFA logo" />
          <h1>MFA Racing</h1>
        </HTML.Header>

        { raceDay.canRace() &&
         <CurrentRacesPartial raceDay={raceDay} /> }

        <div className="overflow-y-scroll">
          <FinishedRacesPartial raceDay={raceDay} />

          <SetupPartial {...{raceDay, volunteers, conditions}} />

          <div className="row-2 p-4">
          <span className="grow">&nbsp;</span>
        </div>
        </div>
      </main>
    </>
  );
}

/**
 * This is the component that shows the tiles for setting up the race day, including
 * tiles for adding / managing racers and volunteers, as well as configuring the race
 * day and recording weather conditions.
 */
function SetupPartial({ raceDay, volunteers, conditions }: { raceDay: RaceDay, volunteers: VolunteerSchema[], conditions: ConditionsSchema}) {
  const nextStep = useNextSteps()

  // Tile for adding racers
  function _AddRacers() {
    const count = raceDay._racers.length

    const subtitle = <>
      <strong>{ raceDay.racers('A').length }</strong> A fleet
      <br />
      <strong>{ raceDay.racers('B').length }</strong> B fleet
    </>

    const className = 
      nextStep.props.state === 'Ready'             ? "tile-done" :
      nextStep.props.state === 'Not enough racers' ? "tile-emphasize" :
      nextStep.props.state === 'No racers'         ? "tile-emphasize" :
                                      "tile"

    const props = {
      href: "/setup/racers",
      title: nextStep.props.state === 'No racers' ? '+' : 'Racers',
      subtitle: nextStep.props.state === 'No racers' ? 'Add racers' : subtitle,
      className
    }

    return <NavTile.Base {...props} />
  }

  // Tile for adding volunteers
  function _AddVolunteers() {
    const count = volunteers.length

    const chair = volunteers.find( v => v.role === 'Race committee' )

    const className =
      nextStep.props.state === 'Ready' ? "tile-done" :
      nextStep.props.state === 'No RC' ? "tile-emphasize" :
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

  // Tile for managing weather conditions
  function _Conditions() {
    const tempMin = conditions.temperatureMin
    const tempMax = conditions.temperatureMax
    const windMin = conditions.windSpeed
    const windMax = conditions.gustSpeed

    const href = "/setup/conditions"

    const className = 
      !tempMin          ? "tile-todo" :
      nextStep.props.state === 'Ready' ? "tile-done" :
                          "tile"

    return tempMin
    ? <NavTile.Base title={ `${tempMin} - ${tempMax}°F` } subtitle={ `${windMin} - ${windMax}kts` } href={href} className={ className } />
    : <NavTile.Base title="+" subtitle="Weather conditions" href={href} className={ className } />
  }

  // Tile for editing race details
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
      nextStep.props.state === 'Ready'           ? "tile-done" :
      nextStep.props.state === 'No race details' ? "tile-emphasize" :
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
      <nextStep.FC {...nextStep.props} />

      <div className="p-4 col-2">
        <div className="row-2">
          <HTML.H2 className="grow">Setup</HTML.H2>
          <ManageDataButton />
        </div>

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

/** Button to open the screen for clearing data in the app */
function ManageDataButton() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/setup/reset')
  }

  return (
    <button className="text-aqua-500" onClick={ handleClick }>
      <small>Manage data</small>
    </button>
  )
}

/** 
 * Main section showing either the START RACE button or the currently
 * running race for each fleet
 */
function CurrentRacesPartial({ raceDay }: {raceDay:RaceDay}) {
  const fleets: (FleetSchema | undefined)[] = raceDay.racingFleets || []
  const className = `gap-2 grid grid-cols-${ fleets.length }`

  // Create a Map object that finds the ongoing / unfinished race for each fleet, if any
  let currentRaces = new Map<FleetSchema|undefined, RaceSchema|undefined>()
  fleets.forEach( fleet => currentRaces.set(fleet, raceDay.unfinishedRaces(fleet)[0]) )

  return (
    <section className={styles.currentRaces}>
      <div className="row-2">
        <HTML.H2 className="grow">Current race</HTML.H2>
        <ViewScoresButton raceDay={raceDay} />
      </div>

      <div className={className}>
      {
        fleets.map( (fleet, i) => (
          currentRaces.get(fleet)
          ? <Race.View race={ currentRaces.get(fleet)! } key={i} />
          : <StartRaceButton {...{fleet, raceDay}} key={i} />
        ))
      }
      </div>
    </section>
  )
}

/** Button to view the scores for the day. Only shown when all fleets have at least completed race */
function ViewScoresButton({ raceDay }: {raceDay:RaceDay}) {
  const router = useRouter()

  // VIEW SCORES link should be shown only when each fleet has at least 1 finished race
  const showButton = raceDay.racingFleets && raceDay.racingFleets // array of racing fleets
    .map( fleet => raceDay.finishedRaces(fleet).length )          // array of finished race counts
    .reduce( (agg, raceCount) => agg && raceCount>0, true )       // check that all counts are > 0

  const handleClick = () => {
    router.push('/scores')
  }

  return showButton
  ? <button className="text-aqua-500" onClick={ handleClick }>
      <small>View scores</small>
    </button>
  : null
}

/** Main section containing all of the completed races */
function FinishedRacesPartial({raceDay}: {raceDay: RaceDay}) {
  // Don't render anything if racing can't happen yet, or if no races have been run yet
  if (!raceDay.canRace()) return // "can't race"
  if (raceDay.finishedRaces().length === 0 ) return // "no finishes"

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