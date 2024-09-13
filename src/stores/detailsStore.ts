import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { fleetSchema, sailSizeSchema } from '@/schemas/default'

interface DetailsStore {
  config: ConfigSchema,

  updateConfig: (newConfig: ConfigSchema) => void,
}

export const useDetailsStore = create(
  persist<DetailsStore>(
    (set, get) => ({
      config: {
        sailSize: 'small',
        fleets: ['AB']
      },

      updateConfig: (data: ConfigSchema) => {
        // newConfig.sailSize && sailSizeSchema.parse(newConfig.sailSize)
        let newConfig = {} as ConfigSchema

        newConfig.sailSize = sailSizeSchema.parse(data.sailSize)
        newConfig.fleets = data.fleets.map( (f:any) => fleetSchema.parse(f) )

        set({
          config: {
            ...get().config,
            ...newConfig
          }
        })
      }
    }),
    { name: 'details-storage' },
  ),
)