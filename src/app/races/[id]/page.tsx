'use client'

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useRaceDayStore } from "@/stores/raceDayStore"

import { Race, RaceState } from "@/models/race"

import Tile, { FinisherTile, FailureTile } from "@/components/tile"
import { Duration, Timer } from "@/components/timer"
import { ModalTile } from "@/components/tile"
import HTML from "@/components/html"

export default function RacePage({params}: {params: {id: string}}) {
  
  /*== Hooks ==*/
  const [raceState, setRaceState] = useState<RaceState>('before-start')

  // The current race to display
  const [_races, cancelRace, finishRacer] = useRaceDayStore(s => [s.races, s.cancelRace, s.finishRacer])
  const _race = _races.find(r=>r.id===params.id)
  const _racers = useRaceDayStore(s=>s.racers)
  
  const race = _race && new Race(_race, _racers)

  const [initialState, duration] = _race ? race!.fullRaceState : []
  
  const router = useRouter()

  useEffect(() => {
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
  }, [_race])

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
      <div className="col-2 py-4">
        <h2 className="px-4"><strong>Still racing</strong></h2>

        <div className="row-wrap-2 w-full">
          {
            race!.unfinishedRacers.map( r => (
              <StillRacingTile key={r.id} racer={r} race={_race!} finishRacer={finishRacer} />
            ) )
          }
        </div>
      </div>
    )
  }

  return (
    <div>
      <header className="p-4 row-2">
        <HTML.back /> Single race { _race!.id } { _race.fleet ? '' : '(combined)'}
      </header>

      {/* Timer, course */}
      <_Banner />

      {/* Show the finishers when racing */}
      { raceState === 'racing' && race && <FinishersPartial race={race} /> }

      { !race!.isFinished && <_StillRacing /> }
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
      <div className="py-4 col-2 bg-ocean-200">

        <HTML.h1 className="px-4">Finshers</HTML.h1>
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
            <HTML.h1 className="px-4">Disqualified</HTML.h1>
            <div className="py-4 overflow-x-scroll scroll-smooth" ref={wrapper}>
              <div className="row-2 mx-4">
                { race!.failedFinishers.map( (f,i) => (
                    <FailureTile key={i} position={i} racer={ f } />
                  ))
                }
              </div>
            </div>
          </>
        }
      </div>
    )
  }

  function StillRacingTile({racer, race, finishRacer}:
    {racer: RacerSchema, race: RaceSchema, finishRacer: (racer: RacerSchema, race: RaceSchema, failure?: FailureSchema) => void}
  ) {
    const [hide, setHide] = useState<boolean>(true)

    const failures: FailureSchema[] = ['DSQ','DNF','DNS','TLE']

    const onShowFailures: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      console.log('onShowFailures')
      e.preventDefault()
      e.stopPropagation()

      setHide( false )
    }

    return (
      <ModalTile racer={racer}>
        <div className="col-0 gap-[1px] bg-gray-300">
          <button
            className="ContextMenuPrimary"
            onClick={ () => finishRacer(racer, race) }
          >
            Finish
          </button>
          
          { hide
            ? <button
                className="ContextMenuSecondary"
                onClick={ onShowFailures }
              >
                Disqualify
              </button>
            : failures.map( d => (
                <button
                  className="ContextMenuSecondary"
                  onClick={ () => finishRacer(racer, race, d) }
                  >{d}</button>
              ))
          }
        </div>
      </ModalTile>
    )
  }