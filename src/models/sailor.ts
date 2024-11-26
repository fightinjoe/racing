// Received an error when importing only sailorSchema, where it was an object containing
// all of the schemas. Explicitly importing all schemas works around this bug.
import * as schemas from "@/schemas/default"

export default class Sailor {
  static CONFIG = {
    ROSER_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQhFyLfWeSah-H-wTluFVS_CEYeHCmGIkhHzwbHazKk4-ZY-TlD3I4Y7y4ZeXMIW7R2XMFlRf3bk3nG/pub?gid=1750180491&single=true&output=tsv'
  }

  static async fetchRoster(): Promise<SailorSchema[]> {
    const response = await fetch(Sailor.CONFIG.ROSER_URL)
    const text = await response.text()
    const rows = text.split('\n')

    // Remove the header row
    rows.shift()

    const sailors = rows.map( row => {
      const [name, suggestedSailNumbers, suggestedFleet] = row.split('\t')
      
      let sailor: SailorSchema

      try {
        sailor = schemas.sailorSchema.parse({
          id: Date.now() + name,
          name,
          suggestedSailNumbers: suggestedSailNumbers.split('/'),
          suggestedFleet
        })
        
      } catch (error) {
        debugger
        throw error
      }

      return sailor
    })

    return sailors
  }
}