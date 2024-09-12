'use client'

import { NavTile } from "@/components/tile"
import HTML from "@/components/html"
import Race from "@/components/race"

import { useRaceStore } from "@/stores/raceStore"
import { useRacerStore } from "@/stores/racerStore"
import { RaceDay } from "@/models/raceday"

export default function Home() {
  const racers = useRacerStore(s=>s.racers)
  const races = useRaceStore(s=>s.races)

  const raceDay = new RaceDay(racers, races)

  return (
    <main>
      <img src="/MFA_splash.png" />

      <section className="bg-white p-4">
        { raceDay.canRace()
          ? <RacesPartial {...{raceDay}} />
          : <SetupPartial {...{raceDay}} />
        }
      </section>
      
      <section className="bg-gray-100 px-4">
        { raceDay.canRace() && <SetupPartial {...{raceDay}} /> }
      </section>
    </main>
  );
}

function SetupPartial({ raceDay }: { raceDay: RaceDay}) {
  return (
    <div className="p-4 col-2">
      <HTML.h1>Setup</HTML.h1>

      <NavTile
        title="Racers"
        subtitle={ raceDay.racers().length+'' }
        href="/racers"
      />
    </div>
  )
}

function RacesPartial({ raceDay }: { raceDay: RaceDay}) {
  const unfinishedRaces = raceDay.unfinishedRaces()
  const finishedRaces = raceDay.finishedRaces()

  // Print either the current race, or the option to start a race
  const _CurrentRace = () => unfinishedRaces.length
    ? <Race.run race={unfinishedRaces[0]} />
    : <Race.start /> 

  return (
    <div className="col-2">
      {/* Either the current race, or the CTA to start a race */}
      <div className="col-2">
        <_CurrentRace />
      </div>

      {/* All of the finished races */}
      <div className="col-2">
        { finishedRaces.map( r => <Race.show race={r} key={r.id} /> )}
      </div>
    </div>
  )

  return 
}