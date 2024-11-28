import { z } from "zod"
import * as Schemas from "@/schemas/default"

declare global {
  type RoleSchema = z.infer<typeof Schemas.roleSchema>
  type FleetSchema = z.infer<typeof Schemas.fleetSchema>
  type SailSizeSchema = z.infer<typeof Schemas.sailSizeSchema>
  type CourseSchema = z.infer<typeof Schemas.courseSchema>
  type ConfigSchema = {
    sailSize: SailSizeSchema,

    // Whether the fleets race separately (true) or together (false)
    raceSeparateFleets: boolean,

    // Track whether the race configuration has been saved at least once
    hasSaved: boolean
  }
  
  type FailureSchema = z.infer<typeof Schemas.failureSchema>

  type SailorSchema = z.infer<typeof Schemas.sailorSchema>
  type VolunteerSchema = z.infer<typeof Schemas.volunteerSchema>
  type RacerSchema = z.infer<typeof Schemas.racerSchema>
  
  type FinisherBaseSchema = z.infer<typeof Schemas.finisherBase>
  type FinisherSchema = z.infer<typeof Schemas.finisherSchema>
  type RaceSchema = z.infer<typeof Schemas.raceSchema>
  
  type ConditionsSchema = z.infer<typeof Schemas.conditionsSchema>
  type WindDirectionSchema = z.infer<typeof Schemas.windDirectionSchema>

  type ScoringPositionSchema = z.infer<typeof Schemas.scoringPositionSchema>
  type RacerScoresSchema = z.infer<typeof Schemas.racerScoresSchema>
  type FleetScoresSchema = z.infer<typeof Schemas.fleetScoresSchema>
  type ResultSchema = z.infer<typeof Schemas.resultSchema>
}