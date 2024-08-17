import { create } from 'zustand'
import { Participant } from '@/models/default'
import { devtools, persist, PersistStorage } from 'zustand/middleware'

interface RacerState {
  racers: Participant[],
  
  isReadyToRace: boolean,

  addRacer: (racer: Participant) => void
}

/** Helpers **/

function isReadyToRace(racers: Participant[]): boolean {
  return racers.length >= MIN_RACERS
}

/** State variables **/
const MIN_RACERS = 5

const name = 'racer-storage'

const storage: PersistStorage<RacerState> = {
  getItem: (name) => {
    const json = localStorage.getItem(name)
    if (!json) return null

    const {state} = JSON.parse(json)

    const racers = state.racers.map( (r:ParticipantSchema) => new Participant(r) )

    return ({
      state: {
        ...state,
        racers,
        isReadyToRace: isReadyToRace(racers)
      }
    })
  },
  setItem: (name, newValue) => {
    const json = JSON.stringify(newValue)
    localStorage.setItem(name, json)
  },
  removeItem: (name) => localStorage.removeItem(name),
}


/** State hook **/
export const useRacerStore = create<RacerState>()( devtools( persist(
  (set) => ({
    racers: [],

    isReadyToRace: false,

    addRacer: (racer) => set((state) => {
      const racers = [...state.racers, racer]
      return {
        racers,
        isReadyToRace: isReadyToRace(racers)
      }
    }),
  }),
  { name, storage },
)))