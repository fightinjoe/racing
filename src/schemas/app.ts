import { z } from "zod"

export const stateMachineSchema = z.enum([
  'No racers', 'Not enough racers', 'No RC', 'No race details', 'Ready'
])