import { Participant, Race } from './default'
import { prisma } from '@/lib/prisma'

/**
 * Model with convenience functions for working with a RaceDay object
 */
export class RaceDay {
  rawData: RaceDaySchema

  participants: Participant[]
  races: Race[]

  /*== Static methods ==*/
  
  static all = findAll
  static create = create

  /*== Constructor ==*/

  constructor(rawData: RaceDaySchema) {
    this.rawData = rawData
    this.rawData.date ||= new Date()

    this.participants = this.rawData.participants.map( p => new Participant(p) )
    this.races = this.rawData.races.map( r => new Race(r, this._getParticipants(r.fleet)) )
  }

  /*== Instance methods ==*/

  addParticipant(sailor: SailorSchema, role: RoleSchema, fleet?: FleetSchema) {
    if( this.participants.find( p => p.id === sailor.id ) )
      throw new Error(`Sailor "${sailor.name}" already added as participant`)
    
    this.participants.push(new Participant({sailor, role, fleet}))
  }

  private _getParticipants(fleet?: FleetSchema) {
    return !!fleet
    ? this.participants.filter( p => p.fleet === fleet )
    : this.participants
  }

  startRace(fleet: FleetSchema): Race {
    if( this.races.find( r => ((r.fleet === fleet) && !r.finished) ))
      throw new Error(`Race for fleet ${fleet} already started`)
    
    // Start, record and return the new race object
    const race = Race.start(fleet, this._getParticipants(fleet))
    this.races.push(race)
    return race
  }
}

/**
 * 
 * @returns Returns an array of all racedays
 */
function findAll() {
  return prisma.raceday.findMany()
}

function create() {
  return prisma.raceday.create({
    data: {}
  })
}