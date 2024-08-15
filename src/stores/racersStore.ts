import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface RacersState {
  racers: ParticipantSchema[],
  
  isReadyToRace: boolean,

  addRacer: (racer: ParticipantSchema) => void
}

const MIN_RACERS = 5

export const useRacersStore = create<RacersState>()( devtools( persist(
  (set) => ({
    racers: [],

    isReadyToRace: false,

    addRacer: (racer) => set((state) => {
      const racers = [...state.racers, racer]
      return {
        racers,
        isReadyToRace: racers.length >= MIN_RACERS
      }
    }),
  }),
  {
    name: 'racers-storage',
  },
)))