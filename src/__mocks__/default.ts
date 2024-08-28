const baseTime = 1713975464632 // Wed Apr 24 2024 12:17:44 GMT-0400

const mockWeather: WeatherSchema = {
  windSpeed: 12,
  gustSpeed: 17,
  windDirectionMin: "NW",
  windDirectionMax: "NE",
  temperature: 35,
  condition: "Overcast",
  current: "low tide"
}

const mockConfig: RaceDayConfigSchema = {
  combinedFleets: false,
  sailSize: "small"
}

/*== Sailors, participants ==*/

export const mockSailorA1: SailorSchema = {
  id: 'a',
  name: 'Aaron Aardvark'
}

export const mockSailorA2: SailorSchema = {
  id: 'b',
  name: 'Betty Boop'
}

export const mockSailorB1: SailorSchema = {
  id: 'm',
  name: 'Matty Moore'
}

export const mockSailorB2: SailorSchema = {
  id: 'n',
  name: 'Nancy Neilson'
}

export const mockSailor_new: SailorSchema = {
  id: 'new_1',
  name: 'Newton Newburg'
}

export const mockSailorRC: SailorSchema = {
  id: 'rc',
  name: 'Rex Comstock'
}

export const mockRacerA1: ParticipantRow = {
  sailor: mockSailorA1,
  fleet: 'A',
  role: 'Racer'
}

export const mockRacerA2: ParticipantRow = {
  sailor: mockSailorA2,
  fleet: 'A',
  role: 'Racer'
}

export const mockRacerB1: ParticipantRow = {
  sailor: mockSailorB1,
  fleet: 'B',
  role: 'Racer'
}

export const mockRacerB2: ParticipantRow = {
  sailor: mockSailorB2,
  fleet: 'B',
  role: 'Racer'
}

export const mockRaceCommittee: ParticipantRow = {
  sailor: mockSailorRC,
  role: 'Race committee'
}

/*== A fleet races ==*/
export const mockFinisher_A_F01: FinishSchema = {
  participant: mockRacerA1,
  finishedAt: new Date(baseTime + (1000*60*15))
}

export const mockFinisher_A_F02: FinishSchema = {
  participant: mockRacerA2,
  failure: 'DNF'
}

export const mockRaceA1: RaceSchema = {
  fleet: 'A',
  startTime: new Date(baseTime),
  finishers: [mockFinisher_A_F01, mockFinisher_A_F02]
}

export const mockRaceA2: RaceSchema = {
  fleet: 'A',
  startTime: new Date(baseTime + (1000*60*17)),
  finishers: []
}

/*== B fleet races ==*/
export const mockFinisher_B_F01: FinishSchema = {
  participant: mockRacerB1,
  finishedAt: new Date(baseTime + (1000*60*20))
}

export const mockRaceB1: RaceSchema = {
  fleet: 'B',
  startTime: new Date(baseTime),
  finishers: [mockFinisher_B_F01]
}

export const mockRace_Complete = mockRaceA1
export const mockRace_NotStarted = mockRaceA2
export const mockRace_Ongoing = mockRaceB1

/**
 * Represents a standard race day where two fleets are racing separately.
 * In the default state, A Fleet has completed their first race and
 * are awaiting their second. B Fleet has started but not finished their
 * first race (mockRacerB2 is the one who hasn't finished)
 */
export const mockRaceDay: RaceDaySchema = {
  date: new Date(baseTime),
  races: [ mockRaceA1, mockRaceB1],
  participants: [
    mockRacerA1,
    mockRacerA2,
    mockRacerB1,
    mockRacerB2,
    mockRaceCommittee
  ],

  weather: mockWeather,
  config: mockConfig
}