import { useEffect, useState } from "react"

import { Race } from "@/models/race"
import type { RaceState } from "@/models/race"

/** useRaceState hook
 * When called with a Race model, tracks the change of the race's state relative
 * to the race duration.
 * 
 * Provides the current race state and duration so that it doesn't need to checked
 * manually.
 * 
 * @returns raceState: 'before-race' | 'countdown' | 'can-recall' | 'racing'
 * 
 * @example
 * function Page() {
 *   const race = new Race(...)
 *   const { raceState } = useRaceState(race)
 * 
 *   return ({
 *     raceState === 'before-start' || raceState === 'countdown'
 *     ? 'Race hasn't begun'
 *     : 'Racing has started'
 *   })
 * }
 */
export function useRaceState(race: Race) {

  const {state, duration} = race.fullRaceState
  
  const [raceState, setRaceState] = useState<RaceState>(state)

  function updateState() {
    setRaceState(race.fullRaceState.state)
  }

  useEffect(() => {
    let intervals: NodeJS.Timeout[] = []
  
    // Update the race state if the race updates but useState has already been called.
    if (state !== raceState) setRaceState(state)
    
    // Set an update to the state machine when going from pre-racing to the
    // starting gun firing (during which the start may be canceled)
    if (raceState === 'countdown') {
      intervals.push(
        setTimeout( updateState, -duration!)
      )
    }

    // Set an update to the state machine for 2 minutes after racing starts
    // (during which a general recall can be issued)
    if (['countdown', 'can-recall'].includes( raceState )) {
      intervals.push(setTimeout(
        updateState, Race.CONFIG.countdownDuration - duration!)
      )
    }

    return () => {
      intervals.map( i => clearTimeout(i) )
    }
  }, [race])

  return { raceState }
}