export class Race {
  // The current race
  _race: RaceSchema

  // All racers participating in the race
  _racers: RacerSchema[]

  constructor(race: RaceSchema, racers: RacerSchema[]) {
    this._race = race
    this._racers = racers
  }

  // The time the race started
  get startTime(): number {
    return this._race.startTime
  }

  // The time the race finished
  get finishTime(): number | undefined {
    if (!this.isFinished ) return undefined

    const lastFinisher = this._race.finishers.at(-1)
    return lastFinisher?.finishedAt
  }

  get finishers(): RacerSchema[] {
    return this._race.finishers
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


}