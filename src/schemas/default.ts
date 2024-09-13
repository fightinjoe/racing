import { z } from "zod"

// The possible roles that a sailor can have as a participant in a race day
export const roleSchema = z.enum(['Racer', 'Race committee', 'Volunteer', 'Crash boat'])

// The different possilble fleets a race might be run for
export const fleetSchema = z.enum(['A', 'B', 'AB'])

export const sailSizeSchema = z.enum(['small', 'large'])

// The different possible ways a racing participant might not finish the race.
// DSQ = Disqualified (see finishers.note)
// DNF = Did not finish
// DNS = Did not start
// TLE = Time limit expired
// RCS = Recourse (used with finisher.positionOverrid)
export const failureSchema = z.enum(['DSQ', 'DNF', 'DNS', 'TLE', 'RCS'])

/**
 * A single sailor and member of the fleet. Can be a volunteer or a racer
 */
export const sailorSchema = z.object({
  // Unique ID that can be used to track a sailor across multiple race days
  id: z.string(),
  name: z.string()
})

/**
 * A single sailor participating in a single race day
 */
const participantBase = z.object({
  // The fleet is only required for role: 'racer'
  fleet: fleetSchema,
  role: roleSchema,
  isGuest: z.boolean(),

  // If racing, the participant's sail number
  sailNumber: z.string().optional(),

  // If racing, the participant's boat name
  boatName: z.string().optional(),

  // If racing, optionally, the class of boat being raced
  boatClass: z.string().optional(),

  // Notes about the participant, such as crew
  note: z.string().optional()
})

export const racerSchema = participantBase.merge( sailorSchema )

/**
 * A single finish for a single sailor for a single race
 */
const finisherBase = z.object({
  // Finishing datetime (if .failure is empty)
  finishedAt: z.number().optional(),

  // Details about the participant's failure to finish the race (if .finishedAt is empty)
  failure: failureSchema.optional(),

  // Override the finisher's finishing position. This is used when a racer either provided assistance
  // to another racer, or was prevented from a proper finish by another racer and RC grants the finisher
  // a synthetic finishing position. NOTE: this position does not displace another finisher who finished
  // at this position, so two finishers will be scored as finishing in the same position. For this,
  // positionOverride should also be marked with failure code RCS
  positionOverride: z.number().optional(),

  // Optional note about the participant's race (such as notes about assisting another distressed sailor)
  note: z.string().optional(),
})

export const finisherSchema = finisherBase.merge( racerSchema )

/**
 * A single race for a given race day
 */
export const raceBase = z.object({
  id: z.string(),

  // The fleet that is racing
  fleet: fleetSchema,

  // The time the race starts
  startTime: z.number(),

  // Freeform array of string notes
  notes: z.array(z.string()).optional(),
})

export const raceSchema = raceBase.merge( z.object({
  finishers: z.array( finisherSchema )
}))

/**
 * Configuration settings for the race day
 */
export const raceDayConfigSchema = z.object({
  // True / false for whether the fleets are sailing together or separately. Any two or more fleets
  // that start and finish at the same time are considered 'combined.' Scoring for the two fleets
  // is still performed separately
  combinedFleets: z.boolean(),

  // Size of the sail
  sailSize: z.enum(['small', 'large'])
})

export const windDirectionSchema = z.enum(['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'])

/**
 * Details about the weather conditions
 */
export const weatherSchema = z.object({
  windSpeed: z.number().optional(),
  gustSpeed: z.number().optional(),
  windDirectionMin: windDirectionSchema.optional(),
  windDirectionMax: windDirectionSchema.optional(),
  temperature: z.number().optional(),
  condition: z.string().optional(),
  current: z.enum(['high tide', 'low tide', 'ebb', 'flood']).optional()
})
