import { z } from "zod"
import * as Schema from "@/schemas/app"

declare global {
  type RacersSort = "added" | "number" | "name" | "fleet"

  type StateMachineSchema = z.infer<typeof Schemas.stateMachineSchema>
}