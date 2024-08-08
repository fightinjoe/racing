'use server'

import { RaceDay } from '@/models/raceday'

export async function create() {
  await RaceDay.create()
  return true
}