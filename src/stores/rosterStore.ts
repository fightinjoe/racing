import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import Sailor from '@/models/sailor'

interface RosterState {
  roster: SailorSchema[],
  timestamp: number,

  clearRoster: () => void,
  fetchRoster: ( cb?: ()=>void ) => void,
  printTimestamp: () => string,
  isStale: () => boolean
}

/**
 * Local store that contains the roster of all sailors registered for the season.
 * The roster is used for auto-completing sailor names and sail numbers.
 */
export const useRosterStore = create<RosterState>()( persist( (set, get) => ({
  roster: [],
  timestamp: Date.now(),

  clearRoster: () => set({roster: [], timestamp: 0}),

  fetchRoster: async (callback?: ()=>void) => {
    const roster = await Sailor.fetchRoster()
    const timestamp = Date.now()

    callback && callback()

    set({roster, timestamp})
  },

  printTimestamp: () => {
    let ts = get().timestamp

    if (ts === 0) return 'Roster not loaded'

    return (new Date(ts)).toLocaleString( 'en-US', {timeZone: 'America/New_York'} )
  },

  // The roster is stale if it's older than 3 days
  isStale: () => {
    const hourLimit = 3
    const now = Date.now()
    const last = get().timestamp

    return now - last > (1000 * 60 * 60 * hourLimit)
  }
}), { name: 'roster-storage' }))