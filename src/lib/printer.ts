/**
 * Pretty prints the duration between the start and end time
 * @param start Start time as milliseconds
 * @param end End time as milliseconds (default to NOW)
 * @returns String formatted like "MM:SS" or "HH:MM:SS"
 */
export function printDuration(start: number, end: number = Date.now()) {
  const milliseconds = (end - start)

  const seconds = Math.abs(Math.floor(milliseconds / 1000))
  const minutes = Math.floor(seconds / 60)
  const hours   = Math.floor(minutes / 60)

  const sign = start > end ? '-' : ''

  // Helper method for prefixing single digits with '0'
  const _pad = (n:number): string => n.toString().padStart(2,'0')

  return hours
  ? `${ sign }${ hours }:${ _pad(minutes % 60) }:${ _pad(seconds % 60) }`
  : `${ sign }${ minutes % 60 }:${ _pad(seconds % 60) }`
}