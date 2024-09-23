export type RaceState = 'before-start' | 'can-recall' | 'racing'

export class Race {
  // The current race
  _race: RaceSchema

  // All racers participating in the race, filtered by `_race.fleet`
  _racers: RacerSchema[]

  static CONFIG = {
    // Time in milliseconds for the countdown
    countdownDuration: 10 * 1000 // 2 * 60 * 1000
  }

  constructor(race: RaceSchema, racers: RacerSchema[] = []) {
    this._race = race

    // If the race does not have a fleet, then all fleets are sailing combined
    this._racers = race.fleet
      ? racers.filter( r => r.fleet === race.fleet )
      : racers
  }

  /*== Simple getters ==*/

  get startTime(): number { return this._race.startTime }

  get finishers(): FinisherSchema[] { return this._race.finishers }
  get qualifiedFinishers(): FinisherSchema[] { return this.finishers.filter( r => !r.failure )}
  get failedFinishers(): FinisherSchema[] { return this.finishers.filter( r => r.failure )}

  get id(): string { return this._race.id }

  get course(): CourseSchema { return this._race.course }

  /*== Calculated getters ==*/

  // The time the race finished
  get finishTime(): number | undefined {
    if (!this.isFinished ) return undefined

    const lastFinisher = this._race.finishers.at(-1)
    return lastFinisher?.finishedAt
  }

  // The list of all racers who haven't yet finished the race
  get unfinishedRacers(): RacerSchema[] {
    const finishedIDs = this._race.finishers.map( racer => racer.id )

    return this._racers.filter( racer => !finishedIDs.includes( racer.id ) )
  }

  get isFinished():boolean {
    // The race is finished when there are no unfinished racers
    return this.unfinishedRacers.length === 0
  }

  // Returns the State Machine state of the race
  get fullRaceState(): [RaceState, number] {
    const duration = Date.now() - this.startTime

    const s =
      duration < 0 ? 'before-start' :
      duration < Race.CONFIG.countdownDuration ? 'can-recall' :
      'racing'

    return [s, duration]
  }

  get raceState(): RaceState {
    return this.fullRaceState[0]
  }

  /**
   * Return whether or not a race can be canceled. Any race that doesn't have
   * any finishers can be canceled
   */
  get canCancel(): boolean {
    return !!this.finishers.length
  }

  /**
   * Boolean representing whether any racher has finished the race yet
   */
  get hasFinishers():boolean {
    return this.finishers.length > 0
  }
}