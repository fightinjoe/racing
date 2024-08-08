/**
 * Sailor class represents an individual sailor by tracking their name and their
 * unique ID. NOTE: this does not track their participation in a race day. For that,
 *   
 * 
 * @example
 *   const mySailor = new Sailor( 1, 'Aaron Wheeler' )
 */
export class Sailor {
  id: string
  name: string

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
  }
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
  rawData: ParticipantSchema

  constructor(rawData: ParticipantSchema) {
    this.rawData = rawData
  }

  get sailor() { return this.rawData.sailor }
  get role() { return this.rawData.role }
  get fleet() { return this.rawData.fleet }

  get name() { return this.sailor.name }
  get id() { return this.sailor.id }
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
  finishers: Finisher[]
  finished: Boolean = false
  participants: Participant[]

  /**
   * Static method for starting a race
   * @param fleet The sailing fleet for the race
   * @param participants The array of participants for the race
   * @returns 
   * @example Race.start(fleet, participants)
   */
  static start(fleet: FleetSchema, participants: Participant[]) {
    const finishers: FinishSchema[] = []
    const startTime = new Date()
    return new Race({ fleet, finishers, startTime }, participants)
  }

  constructor(rawData: RaceSchema, participants: Participant[]) {
    this.rawData = rawData
    this.finishers = this.rawData.finishers.map( f => new Finisher(f) )
    this.participants = participants

    this._checkIfFinished()
  }

  get fleet() { return this.rawData.fleet }

  /**
   * Logs the finish of a single participant in the race
   * @param participant
   * @param failure - Optional - failure code for when not finishing the race
   */
  logFinish(participant: Participant, failure?: FailureSchema): Finisher {
    // Throw an error if the participant has already finished
    if( this.finishers.find( f => f.participant.id === participant.id ) )
      throw new Error(`Sailor "${participant.name}" has already finished`)

    const finisher = new Finisher({
      participant: participant.rawData,
      finishedAt: failure ? undefined : new Date(),
      failure: failure
    })

    this.finishers.push( finisher )

    this._checkIfFinished()

    return finisher
  }

  private _checkIfFinished() {
    // Once the last finisher is logged, flag the race as "finished"
    if( this.finishers.length === this.participants.length )
      this.finished = true
  }
}

export class Finisher {
  rawData: FinishSchema
  participant: Participant

  constructor(rawData: FinishSchema) {
    this.rawData = rawData
    this.participant = new Participant(rawData.participant)
  }

  get finishedAt() { return this.rawData.finishedAt }
  get failure() { return this.rawData.failure }
}