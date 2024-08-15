import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface RacerState {
  racers: ParticipantSchema[],
  
  isReadyToRace: boolean,

  addRacer: (racer: ParticipantSchema) => void
}

const MIN_RACERS = 5

export const useRacerStore = create<RacerState>()( devtools( persist(
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
    name: 'racer-storage',
  },
)))