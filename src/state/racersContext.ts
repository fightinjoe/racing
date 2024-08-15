import type { RacerAction } from './racersReducer'
import { createContext } from 'react'

export const RacersContext = createContext<{
  racersState: ParticipantSchema[],
  racersDispatch: React.Dispatch<RacerAction>
}>({
  racersState: [],
  racersDispatch: () => null
})
