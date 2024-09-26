'use client'

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useRaceDayStore } from "@/stores/raceDayStore"

import { Race, RaceState } from "@/models/race"

import Tile, { Tiles, FinisherTile, FailureTile } from "@/components/tile"
import { Duration, Timer } from "@/components/timer"
import { ModalTile } from "@/components/tile"
import HTML from "@/components/html"
import Button from "@/components/button"

import { useRacerSort } from "@/lib/useRacerSort"

import styles from "./page.module.css"

export default function RacePage({params}: {params: {id: string}}) {
  
  /*== Hooks ==*/
  const [raceState, setRaceState] = useState<RaceState>('before-start')

  // The current race to display
  const [_races, cancelRace, finishRacer] = useRaceDayStore(s => [s.races, s.cancelRace, s.finishRacer])
  const _race = _races.find(r=>r.id===params.id)
  const _racers = useRaceDayStore(s=>s.racers)

  const {Tabs, helpSortRacers} = useRacerSort({sorts: ['number', 'name']})
  
  const race = _race && new Race(_race, _racers)

  const router = useRouter()

  // Setup the timeouts to change the racing state, from 'before-start' to 'can-recall' to 'racing'
  useEffect(() => {
    const [initialState, duration] = _race ? race!.fullRaceState : []

    if (!initialState) return

    // Tracks intervals so they can be canceled when the component is de-rendered
    let intervals: NodeJS.Timeout[] = []
    setRaceState(initialState)

    // Set an update to the state machine when going from pre-racing to the
    // starting gun firing (during which the start may be canceled)
    if (raceState === 'before-start') {
      intervals.push(setTimeout(()=>{
        setRaceState('can-recall')
      }, -duration!))
    }

    // Set an update to the state machine for 2 minutes after racing starts
    // (during which a general recall can be issued)
    if (['before-start', 'can-recall'].includes( raceState )) {
      intervals.push(setTimeout(()=>{
        setRaceState('racing')
      }, Race.CONFIG.countdownDuration - duration!))
    }

    return () => {
      intervals.map( i => clearTimeout(i) )
    }
  }, [_race, raceState])

  if (!_race) return (<strong>404: Race not found</strong>)

  /*== Event handlers ==*/
  const onCancel: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (!confirm('Are you sure?') ) return

    // Go back first to prevent the flashing of 404
    router.back()
    cancelRace(_race)
  }

  /*== Local partials ==*/

  function _Banner() {
    return race!.isFinished ? <_DurationBanner /> : <_TimerBanner />
  }

  // Ticking timer that displays as a banner while a race is being run
  function _TimerBanner() {
    const background = 
      raceState === 'before-start' ? 'bg-yellow-300' :
      'bg-aqua-300'

    const buttonText =
      raceState === 'before-start' ? 'Cancel start' :
      raceState === 'can-recall' ? 'General recall' :
      'Cancel race'

    return (
      <div className={`row-2 items-center pr-4 ${background}`}>

        <strong className={`w-[100px] p-4 border border-white border-0 border-r-2 bg-clear-100`}>
          <Timer start={ race!.startTime } />
        </strong>

        <small className="flex-auto">{race!.course}</small>

        <button className="bg-white px-2 py-1 rounded" onClick={ onCancel }>
          <small>{ buttonText }</small>
        </button>
      </div>
    )
  }

  // Final time for a race displayed as a banner after the race is complete
  function _DurationBanner() {
    return (
      <div className="row-2 items-center">
        <strong className="w-[100px] p-4">
          <Duration start={ race!.startTime } finish={ race!.finishTime! } />
        </strong>
        <small>
          Finished • { race!.course }
        </small>
      </div>
    )
  }

  function _StillRacing() {
    return (
      <div className="col-4">
        <h2><strong>Still racing</strong></h2>

        <Tabs />

        <div className="row-wrap-2 w-full">
          {
            race!.unfinishedRacers
              .sort( helpSortRacers )
              .map( r => (
                race!.raceState === 'racing'
                ? <StillRacingTile key={r.id} racer={r} race={_race!} finishRacer={finishRacer} />
                : <Tiles.Todo key={r.id} title={r.sailNumber} subtitle={r.name} />
              ) )
          }
        </div>
      </div>
    )
  }

  return (
    <div className="col-0 h-full bg-white">
      <HTML.Header>
        <HTML.Back>
          Single race { _race!.id } { _race.fleet ? '' : '(combined)'}
        </HTML.Back>
      </HTML.Header>

      {/* Timer + race course */}
      <_Banner />

      <div className={ styles.wrapper }>
        {/* Show the finishers when racing */}
        { raceState === 'racing' && race && <FinishersPartial race={race} /> }

        {/* Show the racers that are still racing */}
        <section className="p-4">
          { !race!.isFinished && <_StillRacing /> }
        </section>
      </div>
    </div>
  )
}

function FinishersPartial({race}: {race:Race}) {
  const wrapper = useRef(null)

  useEffect(() => {
    if (!wrapper.current) return
    
    const elt = wrapper.current as HTMLDivElement
    elt.scrollLeft = elt.scrollWidth - elt.clientWidth
  },[race])

  return (
    <section className={styles.finishers}>

      <HTML.H1 className="px-4">Finshers</HTML.H1>
      <div className="py-4 overflow-x-scroll scroll-smooth" ref={wrapper}>
        <div className="row-2 mx-4">
          { 
            race!.qualifiedFinishers.length > 0
            ? race!.qualifiedFinishers.map( (f,i) => (
                <FinisherTile key={i} position={i} racer={ f } />
              ))
            : <Tile title="..." subtitle="No finishers" className="TileTodo bg-white" />
          }
        </div>
      </div>

      {
        race!.failedFinishers.length > 0 &&
        <>
          <HTML.H1 className="px-4">Disqualified</HTML.H1>
          <div className="py-4 overflow-x-scroll scroll-smooth">
            <div className="row-2 mx-4">
              { race!.failedFinishers.reverse().map( (f,i) => (
                  <FailureTile key={i} racer={ f } />
                ))
              }
            </div>
          </div>
        </>
      }
    </section>
  )
}

function StillRacingTile({racer, race, finishRacer}:
  {racer: RacerSchema, race: RaceSchema, finishRacer: (racer: RacerSchema, race: RaceSchema, failure?: FailureSchema) => void}
) {
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
    <ModalTile racer={racer}>
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