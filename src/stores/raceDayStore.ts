import { create } from 'zustand'
import { devtools, persist, PersistStorage } from 'zustand/middleware'
import { RaceDay } from '@/models/default'

interface RaceDayState {
  sailors: SailorSchema[],
  racers: ParticipantSchema[],
  races: RaceSchema[],
  currentRaces: {[key in FleetSchema]: string|null},
  finishers: FinisherSchema[],

  addSailor: (name: string) => SailorSchema,
  addRacer: (name: string) => void,
  startRace: (fleet: FleetSchema) => RaceSchema,
  findRace: (id: string) => RaceSchema,
  getRaceDetails: (race: RaceSchema) => {
    allRacers: ParticipantSchema[],
    racers: ParticipantSchema[],
    finishers: FinisherSchema[]
  },
  getCurrentRace: (fleet: FleetSchema) => RaceSchema | undefined,

  findSailor: (id: string) => SailorSchema,
  finishRacer: (race: RaceSchema, racer: ParticipantSchema) => FinisherSchema,

  raceDay: () => RaceDay
}

/** State variables **/
const name = 'race-day-storage'

/** State hook **/
export const useRaceDayStore = create<RaceDayState>()( devtools( persist(
  (set, get) => ({
    sailors: [],
    racers: [],
    races: [],
    currentRaces: {A: null, B: null, AB: null},
    finishers: [],

    addSailor: (name: string) => {
      const id = name.replace(' ','') + Date.now()
      const sailor: SailorSchema = {id, name}
      
      const sailors = [
        ...get().sailors,
        sailor
      ]

      // Update the state
      set({ sailors })

      return sailor
    },

    addRacer: (name: string) => {
      const sailor = get().addSailor(name)

      const racer: ParticipantSchema = {
        sailorId: sailor.id,
        role: 'Racer',
        isGuest: false,
        fleet: 'A'
      }

      const racers = [
        ...get().racers,
        racer
      ]

      set({ racers })
      
      return racer
    },

    findSailor: (id: string) => {
      const sailor = get().sailors.find( s => s.id===id )
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

    findRace: (id: string) => {
      const race = get().races.find( r => r.id === id )
      if (!race) throw new Error(`Could not find race ${id}`)

      return race
    },

    getRaceDetails: (race: RaceSchema) => {
      const allRacers = get().racers.filter( r => r.fleet === race.fleet )

      const finishers = get().finishers
        .filter( f => f.raceId === race.id )

      const racers = allRacers.filter( r => !(finishers.find(f => f.participantId===r.sailorId)) )

      return { allRacers, racers, finishers }
    },

    getCurrentRace: (fleet: FleetSchema) => {
      const raceId = get().currentRaces[fleet]
      if( !raceId ) return undefined

      const race = get().races.find( r => r.id === raceId )
      if( !race ) throw new Error(`Could not locate race ${raceId}`)

      return race
    },

    finishRacer: (race, racer) => {
      // Create the new finisher
      const finisher: FinisherSchema = {
        participantId: racer.sailorId,
        raceId: race.id,
        finishedAt: Date.now()
      }

      // Update the finishers for the cache
      const finishers = [...get().finishers, finisher]

      // Check to see if all of the racers have finished
      const racerCount = get().racers.filter(r => r.fleet === race.fleet).length
      const finishersCount = finishers.filter(f => f.raceId === race.id).length

      const currentRaces = {...get().currentRaces}
      if (racerCount === finishersCount) delete currentRaces[race.fleet]

      set({finishers, currentRaces})

      return finisher
    },

    raceDay: () => (
      new RaceDay({
        sailors: get().sailors,
        racers: get().racers,
        races: get().races,
        currentRaces: get().currentRaces,
        finishers: get().finishers
      })
    )
  }),
  { name },
)))