import * as m from '@/__mocks__/default'
import * as M from '@/models/default'

const participants_raw = m.mockRaceDay.participants
const participants = participants_raw.map( p => new M.Participant(p) )

describe('Race', () => {
  describe('class method start', () => {
    it('should return a new race instance', () => {
      const fleet = 'A'
      const race = M.Race.start(fleet, participants)

      expect(race.fleet).toBe(fleet)
      expect(race.participants.length).toBe( participants_raw.length )
    })
  })

  describe('instance method logFinish', () => {
    let finishedRace:M.Race
    let unfinishedRace:M.Race
    let unfinishedRacer:M.Participant

    beforeEach(() => {
      finishedRace = new M.Race(m.mockRaceA1, participants.filter( p => p.fleet === 'A' ))
      unfinishedRace = new M.Race(m.mockRaceB1, participants.filter( p => p.fleet === 'B' ))
      unfinishedRacer = new M.Participant(m.mockRacerB2)
    })

    it('should log the finish', () => {
      const finishedCount = unfinishedRace.finishers.length
      expect(unfinishedRace.finished).not.toBeTruthy()
      
      const finisher = unfinishedRace.logFinish( unfinishedRacer )
      expect(unfinishedRace.finished).toBeTruthy()
      expect(unfinishedRace.finishers.length).toBe( finishedCount + 1 )

      expect(finisher.failure).not.toBeTruthy()
    })

    it('should log a failed finisher', () => {
      const finishedCount = unfinishedRace.finishers.length
      expect(unfinishedRace.finished).not.toBeTruthy()
      
      const finisher = unfinishedRace.logFinish( unfinishedRacer, 'DNF' )
      expect(unfinishedRace.finished).toBeTruthy()
      expect(unfinishedRace.finishers.length).toBe( finishedCount + 1 )

      expect(finisher.failure).toBeTruthy()
    })

    it('should fail to log the same finisher twice', () => {
      const finisher = unfinishedRace.finishers[0].participant

      expect(() => unfinishedRace.logFinish(finisher)).toThrow()
    })

    it('should mark the race as finished when the last participant finishes', () => {
      expect(unfinishedRace.finished).not.toBeTruthy()
      
      unfinishedRace.logFinish( unfinishedRacer )
      expect(unfinishedRace.finished).toBeTruthy()
    })
  })
})

// describe('Participant', () => {
  
// })