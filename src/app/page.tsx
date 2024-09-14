'use client'

import { NavTile } from "@/components/tile"
import HTML from "@/components/html"
import Race from "@/components/race"
import NextStep from "@/components/nextStep"

import { useRaceStore } from "@/stores/raceStore"
import { useRacerStore } from "@/stores/racerStore"
import { useDetailsStore } from "@/stores/detailsStore"
import { RaceDay } from "@/models/raceday"

import { capitalize } from "@/lib/string"

export default function Home() {
  const racers = useRacerStore(s=>s.racers)
  const races = useRaceStore(s=>s.races)
  const config = useDetailsStore(s=>s.config)

  const raceDay = new RaceDay(racers, races, config)

  return (
    <main>
      <img src="/MFA_splash.png" />

      {/* Banner communicating what the next steps are */}
      <NextStep />

      {/* Shows the races once configuration is done. Otherwise shows configuration setup */}
      <section className="bg-white p-4">
        { raceDay.canRace()
          ? <RacesPartial {...{raceDay}} />
          : <SetupPartial {...{raceDay}} />
        }
      </section>
      
      {/* Config settings, only shown once racing can start */}
      <section className="bg-gray-100 px-4">
        { raceDay.canRace() && <SetupPartial {...{raceDay}} /> }
      </section>
    </main>
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
    <div className="p-4 col-2">
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

function RacesPartial({ raceDay }: { raceDay: RaceDay}) {
  const _FleetRaces = ({fleet}: {fleet: FleetSchema}) => {
    const unfinishedRaces = raceDay.unfinishedRaces( fleet )
    const finishedRaces = raceDay.finishedRaces( fleet )

    return (
      <div className="col-2">
        {/* Either the current race, or the CTA to start a race */}
        <div className="col-2">
          {
            unfinishedRaces.length
            ? <Race.run race={unfinishedRaces[0]} />
            : <Race.start fleet={ fleet } count={ finishedRaces.length+1} /> 
          }
        </div>
  
        {/* All of the finished races */}
        <div className="col-2">
          { finishedRaces.reverse().map( r => <Race.show race={r} key={r.id} /> )}
        </div>
      </div>
    )
  }

  return (
    <div className="row-2">
      {raceDay.fleets.map( (fleet,i) => (<_FleetRaces fleet={fleet} key={i} />) ) }
    </div>
  )
}