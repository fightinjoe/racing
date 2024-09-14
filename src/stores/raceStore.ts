import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface RaceState {
  races: RaceSchema[],

  startRace: (fleet?:FleetSchema) => RaceSchema,
  finishRacer: (racer: RacerSchema, race: RaceSchema) => void,
  clearRaces: () => void
}

export const useRaceStore = create<RaceState>()(
  persist(
    (set, get) => ({
      /**
       * Array of races across all fleets in unpredictable order
       */
      races: [],

      /**
       * Starts a new race, placing it in the object tracking current races
       * @param fleet The racing fleet for which to start the race
       * @returns 
       */
      startRace: (fleet:FleetSchema = 'AB') => {
        const raceCount = get().races.filter(r=>r.fleet===fleet).length

        const race: RaceSchema = {
          id: `${ raceCount+1 }${fleet}`,
          fleet: fleet,
          startTime: Date.now(),
          finishers: []
        }

        set({races:[...get().races,race]})

        return race
      },

      /**
       * Adds a racer to the list of finishers, logging the time they finished
       * @param racer Racer to finish in the race
       */
      finishRacer: (racer, race) => {
        if (race.finishers.find(f=>f.id===racer.id)) throw new Error(`Racer '${racer.name}' has already finished`)

        const finisher:FinisherSchema = {
          ...racer,
          finishedAt: Date.now()
        }

        set({ races: [
          ...get().races.filter(r=>r.id!==race.id),
          { ...race, finishers: [...race.finishers, finisher]}
        ]})
      },

      clearRaces: () => {
        const consent = `Are you sure you want to permanently delete ${ get().races.length } races?`

        if (!confirm(consent)) return

        set({ races: [] })
      }
    }),
    { name: 'race-storage' },
  ),
)