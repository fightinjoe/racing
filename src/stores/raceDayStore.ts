import { create } from 'zustand'
import { devtools, persist, PersistStorage } from 'zustand/middleware'

interface RaceDayState {
  sailors: Map<string, SailorSchema>,
  racers: Map<string, ParticipantSchema>,
  races: RaceSchema[],
  currentRaces: {[key: string]: string},
  finishers: FinisherSchema[],

  addSailor: (name: string) => SailorSchema,
  addRacer: (name: string) => void,
  startRace: (fleet: FleetSchema) => RaceSchema,
  getCurrentRace: (fleet: FleetSchema) => RaceSchema | undefined,

  findSailor: (id: string) => SailorSchema
}

/** State variables **/
const name = 'race-day-storage'

const storage: PersistStorage<RaceDayState> = {
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
export const useRaceDayStore = create<RaceDayState>()( devtools( persist(
  (set, get) => ({
    sailors: new Map(),
    racers: new Map(),
    races: [],
    currentRaces: {},
    finishers: [],

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
    },

    startRace: (fleet: FleetSchema) => {
      // TODO: Check to make sure no current race has already been started for the fleet
      const count = get().races.filter( r => r.fleet === fleet ).length
      const id = `${ count+1 }${ fleet }`

      const race: RaceSchema = {
        id,
        fleet,
        startTime: Date.now()
      }

      set({
        races: [...get().races, race],
        currentRaces: { ...get().currentRaces, [fleet]: id }
      })

      return race
    },

    getCurrentRace: (fleet: FleetSchema) => {
      const raceId = get().currentRaces[fleet]
      if( !raceId ) return undefined

      const race = get().races.find( r => r.id === raceId )
      if( !race ) throw new Error(`Could not locate race ${raceId}`)

      return race
    }
  }),
  { name, storage },
)))