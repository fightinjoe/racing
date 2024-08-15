import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface RacersState {
  racers: ParticipantSchema[],

  addRacer: (racer: ParticipantSchema) => void
}

export const useRacersStore = create<RacersState>()( devtools( persist(
  (set) => ({
    racers: [],

    addRacer: (racer) => set((state) => ({ racers: [...state.racers, racer] })),
  }),
  {
    name: 'racers-storage',
  },
)))