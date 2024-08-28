export const Racer = {
  create: createRacer,

  extend: extendRacer
}

function createRacer(name: string): ParticipantRow {
  const sailor: SailorSchema = {
    id: name + Date.now(),
    name
  }

  const participant: ParticipantRow = {
    sailor,
    role: 'Racer',
    isGuest: false
  }

  return extendRacer(participant)
}

function extendRacer( racer: ParticipantRow ): ParticipantRow {
  return racer
}