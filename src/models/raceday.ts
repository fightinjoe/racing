const RACER_FLOOR = 5

export class RaceDay {
  _racers: RacerSchema[]
  _races: RaceSchema[]

  constructor(racers: RacerSchema[], races: RaceSchema[]) {
    this._racers = racers
    this._races=races
  }

  /**
   * Returns all registered racers, optionally filtered by fleet
   * @param fleet Optional fleet to filter by
   * @returns Array of racers
   */
  racers(fleet?: FleetSchema): RacerSchema[] {
    if (!fleet) return this._racers

    return this._racers.filter(
      r => r.fleet === fleet
    )
  }

  /**
   * Returns all races, optionally filtered by fleet
   * @param fleet Optional fleet to filter by
   * @returns Array of races
   */
  races(fleet?: FleetSchema): RaceSchema[] {
    if (!fleet) return this._races

    return this._races.filter(
      r => r.fleet === fleet
    )
  }

  /**
   * Returns all unfinished races, optionally filtered by fleet
   * @param fleet Optional fleet to filter by
   * @returns Array of races
   */
  unfinishedRaces(fleet?: FleetSchema): RaceSchema[] {
    const unfinishedRaces = this._races.filter(
      r => r.finishers.length < this._racers.length
    )

    if (!fleet) return unfinishedRaces

    return unfinishedRaces.filter( r => r.fleet === fleet )
  }

  /**
   * Returns all finished races, optionally filtered by fleet
   * @param fleet Optional fleet to filter by
   * @returns Array of races
   */
  finishedRaces(fleet?: FleetSchema): RaceSchema[] {
    const finishedRaces = this._races.filter(
      r => r.finishers.length === this._racers.length
    )

    if (!fleet) return finishedRaces

    return finishedRaces.filter( r => r.fleet === fleet )
  }

  canRace(): Boolean {
    return this._racers.length >= RACER_FLOOR
  }
}