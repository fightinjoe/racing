export const Racer = {
  create: createRacer,

  extend: extendRacer
}

function createRacer(name: string): ParticipantSchema {
  const sailor: SailorSchema = {
    id: name + Date.now(),
    name
  }

  const participant: ParticipantSchema = {
    sailor,
    role: 'Racer',
    isGuest: false
  }

  return extendRacer(participant)
}

function extendRacer( racer: ParticipantSchema ): ParticipantSchema {
  return racer
}