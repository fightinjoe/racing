import { z } from "zod"
import * as Schema from "@/schemas/app"

declare global {
  type RacersSort = "added" | "number" | "name" | "fleet"

  type StateMachineSchema = z.infer<typeof Schemas.stateMachineSchema>

  // Type for a generic React Functional component that accepts
  // properties like `className` and `children`
  type GenericFC<EltType = HTMLElement> = React.FC<React.HTMLAttributes<EltType>>
}