'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"
import { RaceDay } from "@/models/raceday"
import { stat } from "fs"

/** Hook that provides access to the state machine that determines
 *  what the user needs to do next in the app.
 * @returns [StateMachineSchema, React banner component]
 */
export function useNextSteps() {
  const [racers, config, volunteers] = useRaceDayStore(s=>[s.racers, s.config, s.volunteers])
  const raceDay = new RaceDay(racers,[],config)

  function determineState(): StateMachineSchema {
    if (racers.length === 0) return 'No racers'

    if (config.raceSeparateFleets && !raceDay.hasEnoughRacers())
      return 'Not enough racers'

    if (!config.raceSeparateFleets && !raceDay.hasEnoughRacers())
      return 'Not enough racers'

    if (volunteers.length === 0) return 'No RC'

    if (!config.hasSaved) return 'No race details'

    return 'Ready'
  }

  const MESSAGES: Record<StateMachineSchema, React.ReactNode> = {
    'No racers': <>Register your first <strong>racer</strong> to get started</>,
    'Not enough racers': config.raceSeparateFleets
      ? <><strong>Add 5 racers</strong> to each fleet to run the first race</>
      : <><strong>Add 5 racers</strong> to run the first race</>,
    'No RC': <>Add a <strong>Race Committee chair</strong> to continue</>,
    'No race details': <>Set the <strong>race details</strong> to start racing</>
  }

  // React component that prints the next step banner
  function NextStep() {
    const state = determineState()

    const message = MESSAGES[state]
  
    if (!message) return
  
    return (
      <small className="p-4 block bg-yellow-100">
        { message }
      </small>
    )
  }

  return { state: determineState(), NextStep }
}