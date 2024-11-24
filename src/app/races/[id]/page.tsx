'use client'

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useRaceDayStore } from "@/stores/raceDayStore"

import { Race } from "@/models/race"

import Tile, { Tiles, FinisherTile, FailureTile } from "@/components/tile"
import { Duration, Timer } from "@/components/timer"
import { ModalTile } from "@/components/tile"
import HTML from "@/components/html"
import Button from "@/components/button"

import { useRacerSort } from "@/lib/useRacerSort"
import { printDuration } from "@/lib/printer"
import { useRaceState } from "@/components/useRaceState"

import styles from "./page.module.css"
import Banner from "@/components/banner"

// Perform a check to make sure the race is available before rendering the
// page. This is necessary because the useRaceState hook cannot run conditionally.
export default function RacePageWrapper({params}: {params: {id: string}}) {
  const _races = useRaceDayStore(s => s.races)
  const _race = _races.find(r=>r.id===params.id)

  return _race
  ? <RacePage _race={_race} />
  : <strong>404: Race not found</strong>
}

function RacePage({_race}: {_race: RaceSchema}) {
  const [cancelRace, finishRacer] = useRaceDayStore(s => [s.cancelRace, s.finishRacer])

  const [_racers, startRace] = useRaceDayStore(s=>[s.racers, s.startRace])

  const {Tabs, helpSortRacers} = useRacerSort({sorts: ['number', 'name']})
  
  const race = new Race(_race, _racers)

  const { raceState } = useRaceState(race!)

  const router = useRouter()

  /*== Event handlers ==*/
  const onButtonClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    raceState === 'before-start'
    ? handleStartRace()
    : handleCancelRace()
  }

  const handleStartRace = () => {
    startRace(_race)
  }

  const handleCancelRace = () => {
    if (!confirm('Are you sure?') ) return

    // Go back first to prevent the flashing of 404
    router.back()
    cancelRace(_race)
  }

  const handleForceStart = () => {
    startRace(_race, true)
  }

  /*== Local partials ==*/

  function _RaceBanner() {
    return race!.isFinished ? <_DurationBanner /> : <_TimerBanner />
  }

  // Ticking timer that displays as a banner while a race is being run
  function _TimerBanner() {
    const background = 
      raceState === 'before-start' ? 'bg-yellow-300' :
      raceState === 'countdown' ? 'bg-yellow-300' :
      'bg-aqua-300'

    const buttonCSS =
      raceState === 'before-start' ? 'bg-ocean-400 text-white' :
      raceState === 'countdown' ? 'bg-white text-ocean-800' :
      'bg-white text-ocean-800'

    const buttonText =
      raceState === 'before-start' ? 'Start countdown' :
      raceState === 'countdown' ? 'Cancel start' :
      raceState === 'can-recall' ? 'General recall' :
      'Cancel race'

    return (
      <div className={`row-2 items-center pr-4 ${background}`}>

        <strong className={`w-[100px] p-4 border border-ocean-900 border-0 border-r-2 bg-clear-400`}>
          {
            race.raceState === 'before-start'
            ? <div>{ printDuration( Date.now() + Race.CONFIG.countdownDuration ) }</div>
            : <Timer start={ race!.startTime! } />
          }
          
        </strong>

        <small className="flex-auto">{race!.course}</small>

        <button className={`${buttonCSS} px-2 py-1 rounded`} onClick={ onButtonClick }>
          <small>{ buttonText }</small>
        </button>
      </div>
    )
  }

  // Final time for a race displayed as a banner after the race is complete
  function _DurationBanner() {
    return (
      <div className="row-2 items-center bg-white">
        <HTML.H1 className="w-[100px] p-4 border-0 border-r-2 border-r-ocean-900 !text-black">
          Done!
        </HTML.H1>
        <small>
          <span>{ race!.course }</span>
          <span><Duration start={ race!.startTime! } finish={ race!.finishTime! } /></span>
        </small>
      </div>
    )
  }

  function _StillRacing() {
    const racers = race!.unfinishedRacers.sort( helpSortRacers )

    const isBeforeRace =
      race!.raceState === 'before-start' ||
      race!.raceState === 'countdown'

    return (
      <div className="col-4">
        <Tabs darkMode={true} />

        <div className="row-wrap-2 w-full">
          {
            racers.map( r => (
              isBeforeRace
              ? <Tile className="tile-todo" key={r.id} title={r.sailNumber} subtitle={r.name} />
              : <StillRacingTile key={r.id} racer={r} race={_race!} finishRacer={finishRacer} />
            ))
          }
        </div>
      </div>
    )
  }

  function _InstructionalBanner() {
    if (raceState === 'before-start') return (
      <Banner.Default>Just entering finishes? <button onClick={ handleForceStart }>Skip the countdown</button></Banner.Default>
    )

    if (raceState === 'countdown') return (
      <Banner.Default>Skip the countdown and <button onClick={ handleForceStart }>start the race</button></Banner.Default>
    )

    if (!race.hasFinishers) return (
      <Banner.Default>Click on a racer to log their finish</Banner.Default>
    )

    return
  }

  // Boolean for determining whether the <FinishersPartial> is shown or not.
  return (
    <div className="col-0 h-full">
      <HTML.BackHeader title={`Race ${ _race!.id } ${ _race.fleet ? '' : '(combined)'}`} />

      {/* Timer + race course */}
      <_RaceBanner />

      <_InstructionalBanner />

      <div className={ styles.wrapper }>
        {/* Show the finishers once racing starts */}
        <FinishersPartial race={race} />

        {/* Show the racers that are still racing */}
        <section className="p-4">
          { !race!.isFinished && <_StillRacing /> }
        </section>
      </div>
    </div>
  )
}

function FinishersPartial({race}: {race:Race}) {
  const [unfinishRacer, moveFinisher] = useRaceDayStore(s => [s.unfinishRacer, s.moveFinisher])

  const wrapper = useRef(null)

  useEffect(() => {
    if (!wrapper.current) return
    
    const elt = wrapper.current as HTMLDivElement
    elt.scrollLeft = elt.scrollWidth - elt.clientWidth
  },[race])

  // Place after hook calls, since hooks cannot be called conditionally
  if (!race.hasFinishers) return

  const finisherCount = race!.qualifiedFinishers.length

  return (
    <section className={styles.finishers}>

      <HTML.H2 className="px-4">Finshers</HTML.H2>
      <div className="overflow-x-scroll scroll-smooth" ref={wrapper}>
        <div className="row-2 mx-4">
          { 
            finisherCount > 0
            ? race!.qualifiedFinishers.map( (finisher,i) => (
                <ModalTile sailor={ {...finisher, positionOverride: i}} key={i}>
                  <Button.Primary onClick={ () => unfinishRacer(finisher, race._race) } className="bg-red-700 hover:!bg-red-800">
                    Remove
                  </Button.Primary>
                  {
                    i !== 0 && <Button.Secondary onClick={ () => moveFinisher(finisher, race._race, i-1)}>
                      Move up
                    </Button.Secondary>
                  }
                  { i !== finisherCount-1 && <Button.Secondary onClick={ () => moveFinisher(finisher, race._race, i+1)}>
                      Move down
                    </Button.Secondary>
                  }
                </ModalTile>
              ))
            : <Tile title="..." subtitle="No finishers" className="tile-todo" />
          }
          <div>&nbsp;</div>
        </div>
      </div>

      {
        race!.failedFinishers.length > 0 &&
        <>
          <HTML.H2 className="px-4 mt-4">Disqualified</HTML.H2>
          <div className="overflow-x-scroll scroll-smooth">
            <div className="row-2 mx-4">
              { race!.failedFinishers.reverse().map( (finisher,i) => (
                  <ModalTile sailor={ finisher } key={i}>
                    <Button.Primary onClick={ () => unfinishRacer(finisher, race._race) } className="bg-red-700 hover:!bg-red-800">
                      Remove
                    </Button.Primary>
                  </ModalTile>
                ))
              }
              <div>&nbsp;</div>
            </div>
          </div>
        </>
      }
    </section>
  )
}

type StillRacingTileProps = {
  racer: RacerSchema,
  race: RaceSchema,
  finishRacer: (racer: RacerSchema, race: RaceSchema, failure?: FailureSchema) => void
}

function StillRacingTile({racer, race, finishRacer}: StillRacingTileProps) {
  const [hide, setHide] = useState<boolean>(true)

  const failures: FailureSchema[] = ['DSQ','DNF','DNS','TLE']

  const onShowFailures: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()

    // get the dialog node
    let parent = e.target as any

    while( parent.nodeName !== 'DIALOG' ) {
      parent = parent.parentNode
    }

    // get the height of the parent
    const dialog = parent as HTMLDialogElement
    const r1 = dialog.getBoundingClientRect()

    // show the buttons
    setHide( false )

    // shift the dialog up by the difference in height, with a timeout
    // to make sure the DOM has updated
    setTimeout(() => {
      const r2 = dialog.getBoundingClientRect()
      dialog.style.top = `${ r1.top - (r2.height - r1.height) }px`
    }, 50)

  }

  return (
    <ModalTile sailor={racer}>
      <div className="col-0 gap-[1px] bg-gray-300">
        <Button.Primary onClick={ () => finishRacer(racer, race) }>
          Finish
        </Button.Primary>
        
        { hide
          ? <Button.Secondary onClick={ onShowFailures }>
              Disqualify
            </Button.Secondary>
          : failures.map( d => (
              <Button.Secondary
                key={d}
                onClick={ () => finishRacer(racer, race, d) }
                >{d}</Button.Secondary>
            ))
        }
      </div>
    </ModalTile>
  )
}