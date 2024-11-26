import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import Sailor from '@/models/sailor'

interface RosterState {
  roster: SailorSchema[],

  clearRoster: () => void,
  fetchRoster: () => void
}

/**
 * Local store that contains the roster of all sailors registered for the season.
 * The roster is used for auto-completing sailor names and sail numbers.
 */
export const useRosterStore = create<RosterState>()( persist( (set, get) => ({
  roster: [],

  clearRoster: () => set({roster: []}),

  fetchRoster: async () => {
    const roster = await Sailor.fetchRoster()
    set({roster})
  }
}), { name: 'roster-storage' }))