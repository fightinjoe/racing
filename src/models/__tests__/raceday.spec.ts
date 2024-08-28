import * as m from '@/__mocks__/default'

import { RaceDay } from '@/models/raceday'

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