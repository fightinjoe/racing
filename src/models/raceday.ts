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

  get sailSize(): string { return this._config.sailSize }

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
   * @param fleet Optional fleet to filter by. Returns all unfinished races if undefined
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
    let count = new Map()

    // Count the racers for each fleet, storing them in a Map keyed by fleet
    this._racers.forEach( r => count.set( r.fleet, (count.get(r.fleet) || 0)+1 ))

    // If any of the fleets have a count of less than RACER_FLOOR, then racing CAN'T begin
    return !Array.from(count.values()).find( c => c < RACER_FLOOR )
  }

  /**
   * Calculate the scores for a single given fleet
   * @param fleet optional, but must be used if there is more than one fleet 
   */
  scores(fleet?: FleetSchema): FleetScoresSchema {
    // Raise an error if the fleet isn't found, or no fleet is passed in when
    // there is more than one fleet
    if( fleet && this.fleets.indexOf(fleet) === -1 )
      throw new Error(`Cannot find scores for '${fleet}' fleet`)

    if( !fleet && this.fleets.length > 1 )
      throw new Error(`Please specify which fleet to score`)

    const racers = this.racers(fleet)
    const races = this.finishedRaces(fleet)
    const failurePoints = racers.length+1

    const lookup = new Map<string, RacerScoresSchema>()

    // init lookup map
    racers.forEach( r => lookup.set(r.id, {racer:r, points:0, positions:[]}) )

    // For each race and each finisher, append finish data to the RacerScores object
    races.map( (race, race_i) => {
      let pos = 1
      race.finishers.map( (finisher) => {
        // The accumulated racer's scores
        let scores = lookup.get(finisher.id)

        if (!scores) throw new Error(`Finishing data for unregistered sailor ${finisher.name}`)

        // Verify that for the Nth race, the racer has finishes
        // for all previous races (i.e. there isn't a race whose
        // finish hasn't been recorded)
        if (scores.positions.length !== race_i)
          throw new Error(`Missing race ${race_i} data for racer ${finisher.name}`)
        
        let position: number | FailureSchema = finisher.positionOverride || (finisher.failure || pos)
        let points = finisher.failure ? failurePoints : pos

        if( !finisher.failure ) pos++

        // The ScoringPosition the the current race
        const score = {points, position, failure: finisher.failure}

        lookup.set(finisher.id, {
          ...scores,
          points: scores.points + points,
          positions: [...scores.positions, score]
        })
      })
    })

    const racerScores: RacerScoresSchema[] = Array.from(lookup.values())
      .sort( (a,b) => a.points < b.points ? -1 : 1)

    return { fleet, racerScores }
  }

  emailScores(): string {
    // race_fleet	is_rc	name	sail_number	start_fleet ...races
    const fleets = this.fleets.length ? this.fleets : [undefined]

    const scores = fleets.map( fleet => this.scores(fleet) )

    const out = scores.map( ({fleet, racerScores}) => (
      racerScores.map( ({racer, positions}) => (
        [
          fleet,
          '',
          racer.name,
          racer.sailNumber,
          racer.fleet,
          ...positions.map( ({position, failure}) => failure ? failure : position )
        ].join(",")
      )).join(";\n")
    )).join(";\n")

    return out
  }
}