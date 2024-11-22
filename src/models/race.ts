export type RaceState =
  'before-start' |  // Nothing has started
  'countdown' |     // Countdown has started but race hasn't
  'can-recall' |    // Race has started, but is within the window for a recall
  'racing' |        // Race has started and can't be recalled
  'finished'        // Race is finished


/**
   * Race model, providing logic and printing methods for an individual race
   * @param race 
   * @param racers All of the racers for the race day. Instantiating the
   * model will automatically filter the racers for the race
   */
export class Race {
  // The current race
  _race: RaceSchema

  // All racers participating in the race, filtered by `_race.fleet`
  _racers: RacerSchema[]

  static CONFIG = {
    // Time in milliseconds for the countdown
    countdownDuration: 2 * 60 * 1000
  }

  constructor(race: RaceSchema, racers: RacerSchema[] = []) {
    this._race = race

    // If the race does not have a fleet, then all fleets are sailing combined
    this._racers = race.fleet
      ? racers.filter( r => r.fleet === race.fleet )
      : racers
  }

  /*== Simple getters ==*/

  get startTime(): number | undefined { return this._race.startTime }

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
    return !!this.startTime && this.unfinishedRacers.length === 0
  }

  // Returns the State Machine state of the race
  /**
   * State Machine for the current race
   * @returns [ RaceState, duration: number ]
   */
  get fullRaceState(): {state: RaceState, duration?: number} {
    if (!this._racers.length) throw new Error('For accurate race state, instantiate the Race model with the RaceDay racers')

    if (!this.startTime) return { state: 'before-start' }
    if (this.isFinished) return { state: 'finished', duration: this.finishTime }

    const duration = Date.now() - this.startTime

    if (duration < 0) return { state: 'countdown', duration }
    if (duration < Race.CONFIG.countdownDuration) return { state: 'racing', duration}

    return { state: 'racing', duration }
  }

  get raceState(): RaceState {
    return this.fullRaceState.state
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