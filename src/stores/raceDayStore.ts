import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Race } from '@/models/race'
import { RaceDay } from '@/models/raceday'

import { sailSizeSchema } from '@/schemas/default'

interface RaceDayState {
  volunteers: VolunteerSchema[],
  racers: RacerSchema[],
  races: RaceSchema[],
  config: ConfigSchema,

  addVolunteer: (name: string, role: RoleSchema) => VolunteerSchema,
  editVolunteer: (volunteer: VolunteerSchema, data: {name:string, role:RoleSchema}) => void,
  deleteVolunteer: (volunteer: VolunteerSchema) => void,

  addRacer: (name: string, sailNumber: string, fleet: FleetSchema) => RacerSchema,
  editRacer: (racer: RacerSchema, data: {name:string, sailNumber: string, fleet: FleetSchema}) => void,
  deleteRacer: (racer: RacerSchema) => void,
  clearRacers: () => void,

  startRace: (course:CourseSchema, fleet?:FleetSchema) => RaceSchema,
  finishRacer: (racer: RacerSchema, race: RaceSchema, failure?: FailureSchema) => void,
  cancelRace: (race: RaceSchema) => void,
  clearRaces: () => void,

  updateConfig: (newConfig: ConfigSchema) => void,
  clearConfig: () => void
}

const DEFAULT_VOLUNTEERS: VolunteerSchema[] = []

const DEFAULT_RACERS: RacerSchema[] = []

const DEFAULT_RACES: RaceSchema[] = []

const DEFAULT_CONFIG: ConfigSchema = {
  sailSize: 'small',
  raceSeparateFleets: true,
  hasSaved: false
}

export const useRaceDayStore = create<RaceDayState>()( persist( (set, get) => ({
  volunteers: DEFAULT_VOLUNTEERS,
  
  racers: DEFAULT_RACERS,
  /**
   * Array of races across all fleets in unpredictable order
   */
  races: DEFAULT_RACES,

  config: DEFAULT_CONFIG,

  addVolunteer: (name, role) => {
    const volunteer = {
      id: Date.now() + name,
      name,
      role
    }

    set({volunteers: [...get().volunteers, volunteer]})
    return volunteer
  },

  editVolunteer: (volunteer, data) => {
    const volunteers = get().volunteers.map( v => {
      return v.id === volunteer.id
      ? { ...v, name: data.name, role: data.role }
      : v
    })

    set({ volunteers })
  },

  deleteVolunteer: (volunteer) => {
    const volunteers = get().volunteers.filter( v => v.id !== volunteer.id )
    set({volunteers})
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

  editRacer: (racer, data) => {
    const racers = get().racers.map( r => {
      if (r.id !== racer.id) return r

      // Update the data for the racer with the same ID
      return {
        ...r,
        name: data.name,
        sailNumber: data.sailNumber,
        fleet: data.fleet
      }
    })

    set({ racers })
  },

  /**
   * Deletes a racer from the data store
   * @param racer RacerSchema for the racer to delete
   */
  deleteRacer: (racer) => {
    const racers = get().racers.filter( r => r.id !== racer.id )
    set({ racers })
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
  },

  clearConfig: () => {
    set({ config: DEFAULT_CONFIG })
  }
}), { name: 'race-day-storage' }))