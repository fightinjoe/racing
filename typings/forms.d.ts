import { z } from "zod"
import * as Schemas from "@/schemas/forms"

declare global {
  type RacerFormSchema = z.infer<typeof Schemas.racerFormSchema>
}

