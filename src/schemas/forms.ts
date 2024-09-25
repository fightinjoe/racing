import { z } from "zod"
import { fleetSchema } from "./default"

export const racerFormSchema = z.object({
  name: z.string()
    .min(3, 'Please add a name'),

  sailNumber: z.string()
    .min(1, 'Please add a sail number'),

  fleet: fleetSchema
})