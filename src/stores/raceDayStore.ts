import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Race } from '@/models/race'
import { RaceDay } from '@/models/raceday'

import { sailSizeSchema } from '@/schemas/default'

interface RaceDayState {
  racers: RacerSchema[],
  races: RaceSchema[],
  config: ConfigSchema,

  addRacer: (name: string, sailNumber: string, fleet: FleetSchema) => RacerSchema,
  clearRacers: () => void,

  startRace: (course:CourseSchema, fleet?:FleetSchema) => RaceSchema,
  finishRacer: (racer: RacerSchema, race: RaceSchema, failure?: FailureSchema) => void,
  cancelRace: (race: RaceSchema) => void,
  clearRaces: () => void,

  updateConfig: (newConfig: ConfigSchema) => void,
}

export const useRaceDayStore = create<RaceDayState>()( persist( (set, get) => ({
  racers: [],
  /**
   * Array of races across all fleets in unpredictable order
   */
  races: [],

  config: {
    sailSize: 'small',
    raceSeparateFleets: true,
    hasSaved: false
  },

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
  },

  /**
   * Starts a new race, placing it in the object tracking current races
   * @param fleet The racing fleet for which to start the race
   * @returns 
   */
  startRace: (course = '1. Triangle', fleet) => {
    // Ensure that a new race for a fleet isn't started if there
    // is already an unfinished race
    const raceDay = new RaceDay(get().racers, get().races, get().config)
    if( raceDay.unfinishedRaces(fleet).length !== 0 )
      throw new Error(`Cannot start a new race when there's an unfinished race${fleet && 'for fleet '+fleet}`)

    const raceCount = get().races.filter(r=>r.fleet===fleet).length

    const race: RaceSchema = {
      id: `${ raceCount+1 }${fleet || ''}`,
      fleet,
      course,
      startTime: Date.now() + Race.CONFIG.countdownDuration,
      finishers: []
    }

    set({races:[...get().races,race]})

    return race
  },

  /**
   * Adds a racer to the list of finishers, logging the time they finished
   * @param racer Racer to finish in the race
   */
  finishRacer: (racer, race, failure) => {
    if (race.finishers.find(f=>f.id===racer.id)) throw new Error(`Racer '${racer.name}' has already finished`)

    let finisher:FinisherSchema = { ...racer }
    failure 
    ? finisher.failure = failure
    : finisher.finishedAt = Date.now()

    set({ races: [
      ...get().races.filter(r=>r.id!==race.id),
      { ...race, finishers: [...race.finishers, finisher]}
    ]})
  },

  /**
   * Cancels an existing race
   */
  cancelRace: (race_schema) => {
    const race = new Race(race_schema)

    if (race.canCancel ) throw new Error('A race that has finishers cannot be canceled')

    set({races:[
      ...get().races.filter( r => r.id !== race.id )
    ]})
  },

  clearRaces: () => {
    const consent = `Are you sure you want to permanently delete ${ get().races.length } races?`

    if (!confirm(consent)) return

    set({ races: [] })
  },

  updateConfig: (data: ConfigSchema) => {
    // Set the config to have been saved whenever it is updated
    let newConfig = { hasSaved: true } as ConfigSchema

    newConfig.sailSize = sailSizeSchema.parse(data.sailSize)
    newConfig.raceSeparateFleets = data.raceSeparateFleets

    set({
      config: {
        ...get().config,
        ...newConfig
      }
    })
  }
}), { name: 'race-day-storage' }))