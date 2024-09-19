const RACER_FLOOR = 5

export class RaceDay {
  _racers: RacerSchema[]
  _races: RaceSchema[]
  _config: ConfigSchema

  constructor(racers: RacerSchema[], races: RaceSchema[], config: ConfigSchema) {
    this._racers = racers
    this._races=races
    this._config=config
  }

  get raceSeparateFleets(): boolean { return this._config.raceSeparateFleets }

  /**
   * Array of all of the "scoring fleets" for racers
   */
  get fleets(): FleetSchema[] {
    return this._racers
      .map(r => r.fleet)
      .filter( (fleet,i,self) => self.indexOf(fleet) === i ) // remove duplicates
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
    return this.races(fleet).filter(
      r => r.finishers.length < this.racers(fleet).length
    )
  }

  /**
   * Returns all finished races, optionally filtered by fleet
   * @param fleet Optional fleet to filter by
   * @returns Array of races
   */
  finishedRaces(fleet?: FleetSchema): RaceSchema[] {
    return this.races(fleet).filter(
      r => r.finishers.length === this.racers(fleet).length
    )
  }

  canRace(): Boolean {
    return this._racers.length >= RACER_FLOOR
  }
}