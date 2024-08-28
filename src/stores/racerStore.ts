import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface RacerState {
  racers: RacerSchema[],

  addRacer: (name: string, sailNumber: string) => RacerSchema
}

export const useRacerStore = create<RacerState>()(
  persist(
    (set, get) => ({
      racers: [],

      addRacer: (name: string, sailNumber: string) => {
        const racer: RacerSchema = {
          name,
          sailNumber,
          role: 'Racer',
          id: name + Date.now(),
          fleet: 'A',
          isGuest: false
        }
        set({ racers: [...get().racers, racer] })
        return racer
      }
    }),
    { name: 'racer-storage' },
  ),
)