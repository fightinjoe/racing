import { z } from "zod"

// The possible roles that a sailor can have as a participant in a race day
export const roleSchema = z.enum(['Racer', 'Race committee', 'Volunteer', 'Crash boat'])

// The different possilble fleets a race might be run for
export const fleetSchema = z.enum(['A', 'B', 'AB'])

// The different possible ways a racing participant might not finish the race
export const failureSchema = z.enum(['DSQ', 'DNF', 'DNS', 'TLE'])

// A single sailor and member of the fleet. Can be a volunteer or a racer
export const sailorSchema = z.object({
  id: z.string(),
  name: z.string(),
})

// A single sailor participating in a single race day
export const participantSchema = z.object({
  sailor: sailorSchema,

  // The fleet is only required for role: 'racer'
  fleet: fleetSchema.optional(),
  role: roleSchema,
})

// A single finish for a single sailor for a single race
export const finisherSchema = z.object({
  participant: participantSchema,
  finishedAt: z.date().optional(),
  failure: failureSchema.optional(),
  note: z.string().optional(),
})

// A single race for a given race day
export const raceSchema = z.object({
  fleet: fleetSchema,
  startTime: z.date(),
  finishers: z.array(finisherSchema),
  note: z.array(z.string()).optional(),
})

export const raceDayConfigSchema = z.object({
  combinedFleets: z.boolean(),
  sailSize: z.enum(['small', 'large'])
})

export const windDirectionSchema = z.enum(['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'])

export const weatherSchema = z.object({
  windSpeed: z.number().optional(),
  gustSpeed: z.number().optional(),
  windDirectionMin: windDirectionSchema.optional(),
  windDirectionMax: windDirectionSchema.optional(),
  temperature: z.number().optional(),
  condition: z.string().optional(),
  current: z.enum(['high tide', 'low tide', 'ebb', 'flood']).optional()
})

// A single race day with multiple races
export const raceDaySchema = z.object({
  date: z.date(),
  races: z.array(raceSchema),
  participants: z.array(participantSchema),

  config: raceDayConfigSchema,
  weather: weatherSchema,
  note: z.string().optional()
})