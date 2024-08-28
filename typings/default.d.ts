import { z } from "zod"
import * as Schemas from "@/schemas/default"

declare global {
  type RoleSchema = z.infer<typeof Schemas.roleSchema>
  type FleetSchema = z.infer<typeof Schemas.fleetSchema>
  type FailureSchema = z.infer<typeof Schemas.failureSchema>

  type SailorRow = z.infer<typeof Schemas.sailorRow>
  type SailorSchema = z.infer<typeof Schemas.sailorSchema>
  type ParticipantRow = z.infer<typeof Schemas.participantRow>
  type RacerSchema = z.infer<typeof Schemas.racerSchema>
  
  type FinisherSchema = z.infer<typeof Schemas.finisherSchema>
  type RaceSchema = z.infer<typeof Schemas.raceSchema>
  type RaceDaySchema = z.infer<typeof Schemas.raceDaySchema>

  type RaceDayConfigSchema = z.infer<typeof Schemas.raceDayConfigSchema>
  type WeatherSchema = z.infer<typeof Schemas.weatherSchema>
  type WindDirectionSchema = z.infer<typeof Schemas.windDirectionSchema>
}