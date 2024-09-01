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
      
      <section className="bg-gray-200 px-4">
        { raceDay.canRace() && <SetupPartial {...{raceDay}} /> }
      </section>
    </main>
  );
}

function SetupPartial({ raceDay }: { raceDay: RaceDay}) {
  return (
    <>
      <HTML.h1>Setup</HTML.h1>

      <NavTile
        title="Racers"
        subtitle={ raceDay.racers().length+'' }
        href="/racers"
      />
    </>
  )
}

function RacesPartial({ raceDay }: { raceDay: RaceDay}) {
  const unfinishedRaces = raceDay.unfinishedRaces()
  const finishedRaces = raceDay.finishedRaces()

  // Print either the current race, or the option to start a race
  const CurrentRacePartial = () => unfinishedRaces.length
    ? <Race.run race={unfinishedRaces[0]} />
    : <Race.start /> 

  return (
    <>
      {/* Either the current race, or the CTA to start a race */}
      <div
        className="flex flex-col gap-2"
      >
        <CurrentRacePartial />
      </div>

      {/* All of the finished races */}
      <div className="flex flex-col gap-2">
        { finishedRaces.map( r => <Race.show race={r} key={r.id} /> )}
      </div>
    </>
  )

  return 
}