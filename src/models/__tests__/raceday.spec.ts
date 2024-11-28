import * as m from '@/__mocks__/default'

import { RaceDay } from '@/models/raceday'

const racers = [
  m.mockRacerA1,
  m.mockRacerA2,
  m.mockRacerA3,
  m.mockRacerA4,
  m.mockRacerA5,
]

const races = [
  m.mockRaceA1,
  m.mockRaceA2,
  m.mockRaceA3,
]

const config = m.mockConfig

describe('RaceDay', () => {
  let raceDay: RaceDay = new RaceDay( racers, races, config )

  beforeEach(() => {
    raceDay = new RaceDay( racers, races, config )
  })

  describe('scoring', () => {
    const score = raceDay.scores('A')

    it('should set the fleet correctly', () => {
      expect(score.fleet).toBe(races[0].fleet)
    })

    it('should have the right number of racer scores', () => {
      expect(score.racerScores.length).toBe(racers.length)
    })

    it('should correctly calculate points', () => {
      const expectedPoints = [6,6,6,15,15]
      const actualPoints = score.racerScores.map(rs => rs.points)

      expect( actualPoints ).toEqual( expectedPoints )
    })

    it('should correctly order finishers', () => {
      const expectedOrder = ['3A', '1A', '2A', '5A', '4A']
      const actualOrder = score.racerScores.map(rs=>rs.racer.sailNumber)

      expect( actualOrder ).toEqual( expectedOrder )
    })

    it.todo('should correctly account for position overrides')
  })
})

/*
const participants_raw = m.mockRaceDay.participants
const races = m.mockRaceDay.races

describe('RaceDay', () => {
  let raceDay: RaceDay

  beforeEach(() => {
    raceDay = new RaceDay( m.mockRaceDay )
  })

  describe('instance method addParticipant', () => {
    it('should add a new racer', () => {
      expect(raceDay.participants.length).toBe( participants_raw.length )
      raceDay.addParticipant( m.mockSailor_new, "Racer" )
      expect(raceDay.participants.length).toBe( participants_raw.length + 1 )
    })

    it('should add a new volunteer', () => {
      expect(raceDay.participants.length).toBe( participants_raw.length )
      raceDay.addParticipant(m.mockSailor_new, "Volunteer")
      expect(raceDay.participants.length).toBe( participants_raw.length + 1 )
    })

    it('should fail adding an existing participant', () => {
      expect(raceDay.participants.length).toBe( participants_raw.length )
      expect(() => {
        raceDay.addParticipant(m.mockSailorA1, "Racer")
      }).toThrow()
      expect(raceDay.participants.length).toBe( participants_raw.length )
    })
  })

  describe('instance method startRace', () => {
    it('should start the race', () => {
      expect(raceDay._races.length).toBe( races.length )
      raceDay.startRace('A')
      expect(raceDay._races.length).toBe( races.length + 1 )
    })

    it('should fail if there is already a race', () => {
      expect(() => raceDay.startRace('B')).toThrow()
    })
  })

  describe('static methods', () => {
    test.todo('should findAll racedays')

    test.todo('shoud create a raceday')
  })
})
  */