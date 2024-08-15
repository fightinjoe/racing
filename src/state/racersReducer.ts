/**
 * Reducer and default value for Race objects.
 * 
 * @example
 * import * as Racers from '@/state/racersReducer'
 * import { useReducer } from 'react'
 * 
 * const [racersState, racersDispatch] = useReducer( Racers.reducer, Racers.defaultValue )
 */
import useCache from "@/lib/useCache"

export interface RacerAction {
  type: 'add',
  racer: ParticipantSchema
}

export const CACHE_KEY = 'racers'

export const [reducer, lookup] = useCache( (state: RaceSchema[], action: RacerAction) => {
  switch(action.type) {
    case 'add': return [...state, action.racer]

    default: return state
  }
}, CACHE_KEY, [])

const fallbackValue: ParticipantSchema[] = []

export const initialValue: ParticipantSchema[] = lookup() || fallbackValue