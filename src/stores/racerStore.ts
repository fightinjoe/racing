import { create } from 'zustand'
import { devtools, persist, PersistStorage } from 'zustand/middleware'

interface RacerState {
  sailors: Map<string, SailorSchema>,
  racers: Map<string, ParticipantSchema>,

  addSailor: (name: string) => SailorSchema,
  addRacer: (name: string) => void,

  findSailor: (id: string) => SailorSchema
}

/** State variables **/
const name = 'racer-storage'

const storage: PersistStorage<RacerState> = {
  getItem: (name) => {
    const json = localStorage.getItem(name)
    if (!json) return null

    const {state} = JSON.parse(json)

    return ({
      state: {
        ...state,
        sailors: new Map(state.sailors),
        racers: new Map(state.racers),
      }
    })
  },

  setItem: (name, newValue) => {
    const json = JSON.stringify({
      ...newValue,
      state: {
        ...newValue.state,
        sailors: Array.from(newValue.state.sailors.entries()),
        racers: Array.from(newValue.state.racers.entries())
      }
    })
    localStorage.setItem(name, json)
  },

  removeItem: (name) => localStorage.removeItem(name),
}

/** State hook **/
export const useRacerStore = create<RacerState>()( devtools( persist(
  (set, get) => ({
    sailors: new Map(),
    racers: new Map(),

    addSailor: (name: string) => {
      const id = name.replace(' ','') + Date.now()
      const sailor: SailorSchema = {id, name}
      
      const sailors = new Map<string, SailorSchema>(get().sailors)
      sailors.set(id, sailor)

      // Update the state
      set({ sailors })

      return sailor
    },

    addRacer: (name: string) => {
      const sailor = get().addSailor(name)

      const racer: ParticipantSchema = {
        sailorId: sailor.id,
        role: 'Racer',
        isGuest: false
      }

      const racers = new Map<string, ParticipantSchema>( get().racers )
      racers.set( sailor.id, racer )

      set({ racers })
      
      return racer
    },

    findSailor: (id: string) => {
      const sailor = get().sailors.get(id)
      if (!sailor) throw new Error(`Unknown sailor ${id}`)
      
      return sailor
    }
  }),
  { name, storage },
)))