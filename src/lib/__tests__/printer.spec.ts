import * as P from '@/lib/printer'

describe('Printer', () => {
  describe('printDuration', () => {
    const start = Date.now()

    describe('when the difference is seconds', () => {
      // End is 5182 milliseconds after the start
      const difference = 5 * 1000 + 182

      it('should work for positive durations', () => {
        expect( P.printDuration(start, start + difference) ).toBe("0:05")
        expect( P.printDuration(start - difference) ).toBe("0:05")
      })
  
      it('should work for negative durations', () => {
        expect( P.printDuration(start, start - difference) ).toBe("-0:06")
        expect( P.printDuration(start + difference) ).toBe("-0:06")
      })
    })

    describe('when the difference is minutes', () => {
      // 3 minutes, 25 seconds, 182 milliseconds
      const difference = (3 * 60 + 25) * 1000 + 182

      it('should work for positive durations', () => {
        expect( P.printDuration(start, start + difference) ).toBe("3:25")
        expect( P.printDuration(start - difference) ).toBe("3:25")
      })
  
      it('should work for negative durations', () => {
        expect( P.printDuration(start, start - difference) ).toBe("-3:26")
        expect( P.printDuration(start + difference) ).toBe("-3:26")
      })
    })

    describe('when the difference is hours', () => {
      // 4 hours, 3 minutes, 25 seconds, 182 milliseconds
      const difference = (((4 * 60) + 3) * 60 + 25) * 1000 + 182

      it('should work for positive durations', () => {
        expect( P.printDuration(start, start + difference) ).toBe("4:03:25")
        expect( P.printDuration(start - difference) ).toBe("4:03:25")
      })
  
      it('should work for negative durations', () => {
        expect( P.printDuration(start, start - difference) ).toBe("-4:03:26")
        expect( P.printDuration(start + difference) ).toBe("-4:03:26")
      })
    })

    it('should work when the start and end are the same', () => {
      expect( P.printDuration(start, start) ).toBe("0:00")
    })
  })
})