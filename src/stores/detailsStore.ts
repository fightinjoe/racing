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
        raceSeparateFleets: true,
        hasSaved: false
      },

      updateConfig: (data: ConfigSchema) => {
        // Set the config to have been saved whenever it is updated
        let newConfig = { hasSaved: true } as ConfigSchema

        newConfig.sailSize = sailSizeSchema.parse(data.sailSize)
        newConfig.raceSeparateFleets = data.raceSeparateFleets

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