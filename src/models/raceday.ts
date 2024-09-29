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
   * Array of the separate "racing fleets", which is dependent on whether the racers
   * are racing as a combined fleet or separately
   * @returns single fleet racing returns `[undefined]`, otherwise an array of the 
   * separate fleets.
   */
  get racingFleets(): (FleetSchema | undefined)[] | undefined {
    // If there are no racers, then don't return `[]`, but rather `undefined`
    if( this.racers().length === 0 ) return undefined

    return this._config.raceSeparateFleets
    ? this.scoringFleets.sort()
    : [undefined]
  }

  /**
   * Array of all of the "scoring fleets" for racers, regardless of whether the racers
   * race in a combined or separate fleets
   */
  get scoringFleets(): FleetSchema[] {
    return this._racers
      .map(r => r.fleet)
      .sort()
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

  /**
   * Determines if the parameters for starting racing have been met
   * @returns true if racing can start, false if not
   */
  canRace(): Boolean {
    // Can't race until the config has been viewed for the first time
    if( !this._config.hasSaved ) return false

    return this.hasEnoughRacers()
  }

  hasEnoughRacers(): Boolean {
    // Can't race if the number of racers is less than RACER_FLOOR
    const fleets = this.racingFleets || [undefined]

    return fleets
      // Calculate the number of racers per fleet
      .map( fleet => (this.racers(fleet).length >= RACER_FLOOR) )

      // Check that there are enough racers for each fleet
      .reduce( (agg, x) => (agg && x), true )
  }

  /**
   * Calculate the scores for a single given fleet
   * @param fleet optional, but must be used if there is more than one fleet 
   */
  scores(fleet?: FleetSchema): FleetScoresSchema {
    // Raise an error if the fleet isn't found, or no fleet is passed in when
    // there is more than one fleet
    if( fleet && this.scoringFleets.indexOf(fleet) === -1 )
      throw new Error(`Cannot find scores for '${fleet}' fleet`)

    const racers = this.racers(fleet)
    const races = this.finishedRaces(fleet)
    const failurePoints = racers.length+1

    const lookup = new Map<string, RacerScoresSchema>()

    // init lookup map
    racers.forEach( r =>
      lookup.set(r.id, {racer:r, points:0, positionCounts: [], positions:[]})
    )

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

        let counts = [...scores.positionCounts]
        counts[ points-1 ] = counts[ points-1 ] ? counts[ points-1 ]+1 : 1

        if( !finisher.failure ) pos++

        // The ScoringPosition the the current race
        const score = {points, position, failure: finisher.failure}

        lookup.set(finisher.id, {
          ...scores,
          points: scores.points + points,
          positionCounts: counts,
          positions: [...scores.positions, score]
        })
      })
    })

    
    const racerScores: RacerScoresSchema[] = Array.from(lookup.values())
      .map( rs => ({...rs, tiebreak: helpCreateTiebreak(rs, lookup.size)}) )
      .sort( (a,b) => 
        a.points < b.points ? -1 :
        a.points > b.points ? 1 :
        a.tiebreak > b.tiebreak ? -1 :
        1
      )

    return { fleet, racerScores }
  }

  emailScores(): string {
    const fleets = this.scoringFleets.length ? this.scoringFleets : [undefined]

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

// Create a number for each racer that can be compared to
// break ties for a race day. The LARGER number should
// be the winner. In general, the racer with more lower
// finishes (e.g. more 2nd place finishes than 4th) breaks
// the tie
function helpCreateTiebreak( r: RacerScoresSchema, racerCount: number ) {
  // The number of races run
  const zeroes = Math.ceil( racerCount / 10 )

  // First, convert the array of positionCounts into a
  // number that can be compared between racers such that
  // the larger number (i.e. the number with the most lowest scoring races)
  // represents the winner of the tie. A racer finishing 1,2,1,4 would
  // return "2101"
  let positionCounts = ""
  for(let j=0; j<=racerCount; j++) {
    const ps = r.positionCounts[j] || 0
    positionCounts +=
      ps.toString().padStart(zeroes,'0')
    
  }

  // For racers that have the same positionCounts, the order
  // of finishes matters, with the last finish taking precedence.
  // For example, if racer A has finishes 1,2,3 and racer B has
  // finishes 3,2,1, Racer B wins. To remain consistent with positionCounts,
  // the larger string should represent the winner 
  let finishes = [...r.positions]
    .reverse()
    .map( (pos,i) => (
      (racerCount + 1 - pos.points).toString().padStart(zeroes,'0')
    ))
    .join('')
  
  return `${positionCounts}.${finishes}`
}