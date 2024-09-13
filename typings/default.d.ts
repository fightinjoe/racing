import { z } from "zod"
import * as Schemas from "@/schemas/default"

declare global {
  type RoleSchema = z.infer<typeof Schemas.roleSchema>
  
  type FleetSchema = z.infer<typeof Schemas.fleetSchema>
  type SailSizeSchema = z.infer<typeof Schemas.sailSizeSchema>
  type ConfigSchema = {
    sailSize: SailSizeSchema,
    fleets: FleetSchema[]
  }
  
  type FailureSchema = z.infer<typeof Schemas.failureSchema>

  type SailorSchema = z.infer<typeof Schemas.sailorSchema>
  type RacerSchema = z.infer<typeof Schemas.racerSchema>
  
  type FinisherSchema = z.infer<typeof Schemas.finisherSchema>
  type RaceSchema = z.infer<typeof Schemas.raceSchema>
  
  type RaceDayConfigSchema = z.infer<typeof Schemas.raceDayConfigSchema>
  type WeatherSchema = z.infer<typeof Schemas.weatherSchema>
  type WindDirectionSchema = z.infer<typeof Schemas.windDirectionSchema>
}