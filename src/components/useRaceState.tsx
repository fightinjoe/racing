import { useEffect, useState } from "react"

import { Race } from "@/models/race"
import type { RaceState } from "@/models/race"

export function useRaceState(race: Race) {
  const {state, duration} = race.fullRaceState

  const [raceState, setRaceState] = useState<RaceState>(state)
  const [raceDuration, setRaceDuration] = useState<number>(duration)

  function updateState() {
    setRaceState(race.fullRaceState.state)
    setRaceDuration(race.fullRaceState.duration)
  }

  useEffect(() => {
    let intervals: NodeJS.Timeout[] = []
    
    // Set an update to the state machine when going from pre-racing to the
    // starting gun firing (during which the start may be canceled)
    if (raceState === 'before-start') {
      intervals.push(
        setTimeout( updateState, -duration!)
      )
    }

    // Set an update to the state machine for 2 minutes after racing starts
    // (during which a general recall can be issued)
    if (['before-start', 'can-recall'].includes( raceState )) {
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