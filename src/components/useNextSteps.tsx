'use client'

import { useRaceDayStore } from "@/stores/raceDayStore"
import { RaceDay } from "@/models/raceday"
import Banner from "./banner"

/** Hook that provides access to the state machine that determines
 *  what the user needs to do next in the app.
 * @returns [StateMachineSchema, React banner component]
 */
export function useNextSteps() {
  const [racers, config, volunteers] = useRaceDayStore(s=>[s.racers, s.config, s.volunteers])
  const raceDay = new RaceDay(racers,[],config)

  const state: StateMachineSchema =
    racers.length === 0
    ? 'No racers' :

    config.raceSeparateFleets && !raceDay.hasEnoughRacers()
    ? 'Not enough racers' :

    !config.raceSeparateFleets && !raceDay.hasEnoughRacers()
    ? 'Not enough racers' :

    volunteers.length === 0
    ? 'No RC' :

    !config.hasSaved
    ? 'No race details' :

    'Ready'

  const MESSAGES: Record<StateMachineSchema, React.ReactNode> = {
    'No racers': <>Register your first <strong>racer</strong> to get started</>,
    'Not enough racers': config.raceSeparateFleets
      ? <><strong>Add 5 racers</strong> to each fleet to run the first race</>
      : <><strong>Add 5 racers</strong> to run the first race</>,
    'No RC': <>Add a <strong>Race Committee chair</strong> to continue</>,
    'No race details': <>Set the <strong>race details</strong> to start racing</>
  }

  return {
    props: { state, message: MESSAGES[state] },
    FC: NextStep
  }
}

// React component that prints the next step banner
function NextStep({ state, message }: { state: StateMachineSchema, message: React.ReactNode }) {
  if (!message) return

  return (
    <Banner.Alert>{ message }</Banner.Alert>
  )
}