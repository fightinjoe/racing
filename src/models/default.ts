/**
 * Sailor class represents an individual sailor by tracking their name and their
 * unique ID. NOTE: this does not track their participation in a race day. For that,
 *   
 * 
 * @example
 *   const mySailor = new Sailor( 1, 'Aaron Wheeler' )
 */
export class Sailor {
  rawData: SailorSchema

  static create(name: string) {
    const id = name + Date.now()
    return new Sailor({id, name})
  }

  constructor(rawData: SailorSchema) {
    this.rawData = rawData
  }

  get id() { return this.rawData.id }
  get name() { return this.rawData.name }

  toJSON() { return this.rawData }
}

/**
 * The Participant class tracks the role of an individual sailor (and metadata) for
 * a single RaceDay.
 * 
 * @example
 *   const myParticipant = new Participant({
 *     sailor: mySailor,
 *     role: 'Racer',
 *     fleet: 'A'
 *   })
 */
export class Participant {
  rawData: ParticipantRow
  sailor: SailorSchema

  constructor(rawData: ParticipantRow, sailor: SailorSchema|undefined) {
    if (!sailor) throw new Error(`Missing sailor data in Participant instantiation`)
    this.rawData = rawData
    this.sailor = sailor
  }

  get role() { return this.rawData.role }
  get fleet() { return this.rawData.fleet }

  get name() { return this.sailor.name }
  get id() { return this.sailor.id }

  toJSON() { return this.rawData }
}

/**
 * A single race on a given day. This is not typically created directly, but
 * is instead created from RaceDay.startRace()
 * 
 * @example
 *   const myRace = myRaceDay.startRace('A')
 */
export class Race {
  rawData: RaceSchema

  constructor(rawData: RaceSchema) {
    this.rawData = rawData
  }

  get fleet() { return this.rawData.fleet }

}

export class Finisher {
  rawData: FinisherSchema
  participant: Participant
  race: Race

  constructor(rawData: FinisherSchema, participant: Participant, race: Race) {
    this.rawData = rawData
    this.participant = participant
    this.race = race
  }

  get finishedAt() { return this.rawData.finishedAt }
  get failure() { return this.rawData.failure }
}

interface Filters {
  fleet?: FleetSchema,
  role: RoleSchema
}

interface RaceDayParams {
  sailors: SailorSchema[],
  racers: ParticipantRow[],
  races: RaceSchema[],
  currentRaces: {[key in FleetSchema]: string|null},
  finishers: FinisherSchema[]
}

export class RaceDay {
  rawSailors: SailorSchema[]
  rawRacers: ParticipantRow[]
  rawRaces: RaceSchema[]
  rawCurrentRaces: {[key in FleetSchema]: string|null}
  rawFinishers: FinisherSchema[]

  // Map object of all the participants in the race day, keyed by their ID
  // for easy lookup
  participants: Map<string, Participant>
  
  constructor({sailors, racers, races, currentRaces, finishers}: RaceDayParams) {
    this.rawSailors = sailors
    this.rawRacers = racers
    this.rawRaces = races
    this.rawCurrentRaces = currentRaces
    this.rawFinishers = finishers

    this.participants = new Map<string, Participant>(
      this.rawRacers.map( racerJSON => {
        const id = racerJSON.sailorId
        const racer = new Participant(racerJSON, sailors.find(s => s.id===id))
        return [id, racer]
      })
    )
  }

  racers(params: Filters = {role:'Racer'}): Participant[] {
    const { fleet, role } = params;
  
    let out = Array.from(this.participants.entries())
      .map(([_, participant]) => participant)
  
    if (fleet) out = out.filter(p => p.fleet === fleet)
    if (role) out = out.filter(p => p.role === role)
  
    return out
  }

}