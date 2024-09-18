import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface RacerState {
  racers: RacerSchema[],

  addRacer: (name: string, sailNumber: string, fleet: FleetSchema) => RacerSchema,
  clearRacers: () => void
}

export const useRacerStore = create<RacerState>()(
  persist(
    (set, get) => ({
      racers: [],

      addRacer: (name, sailNumber, fleet) => {
        const racer: RacerSchema = {
          name,
          sailNumber,
          fleet,
          role: 'Racer',
          id: Date.now() + name,
          isGuest: false
        }
        set({ racers: [...get().racers, racer] })
        return racer
      },

      clearRacers: () => {
        const consent = `Are you sure you want to permanently delete ${ get().racers.length } racers?`

        if (!confirm(consent)) return

        set({ racers: [] })
      }
    }),
    { name: 'racer-storage' },
  ),
)