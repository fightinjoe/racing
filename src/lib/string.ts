export function capitalize(word: string) {
  return `${ word.charAt(0).toUpperCase() }${ word.substring(1) }`
}

export function toId(value: string | number | boolean) {
  return value
    .toString()
    .toLowerCase()
    .replace(/ /g,'-')          // replace ' ' with '-'
    .replace(/[^a-z0-9-]/g, '') // remove non alpha-numeric values
}

// Helper function for sorting sail numbers, which are strings that might look like `17A`.
// Returning -1 indicates sn1 comes first
export function sortSailNumbers(sn1: string, sn2: string) {
  // Regex that will match `17` or `17A`. Will not match `A`
  const regex = /^(\d+)(.*)$/

  // Successful matches will return a (m)atch, (d)igit, and (s)tring
  // Set all variables to `undefined` when the match fails
  const [m1, d1, s1] = sn1.match(regex) || [undefined, undefined, undefined]
  const [m2, d2, s2] = sn2.match(regex) || [undefined, undefined, undefined]

  // If the sail numbers are just strings (i.e. regex failed), then compare them directly
  if (!m1 && !m2) return (sn1 < sn2 ? -1 : 1)

  // If only one isn't a number, then return the numeric one first
  if (!m1) return 1
  if (!m2) return -1

  // Otherwise, compare the sail number first, then the string suffix
  return true &&
    parseInt(d1) < parseInt(d2) ? -1 : 
    parseInt(d1) > parseInt(d2) ? 1 :
    s1.toLowerCase() === s2.toLowerCase() ? -1 :
    s1.toLowerCase() < s2.toLowerCase() ? -1 : 1
}

export function hexToRBG(hex: string) {
  const [r,g,b] = hex.match(/.{2}/g)!.map( x => parseInt(x, 16) )
  return `rgb(${r},${g},${b})`
}

export function hexToRGBA(hex: string, alpha: number) {
  const [r,g,b] = hex.match(/.{2}/g)!.map( x => parseInt(x, 16) )
  return `rgba(${r},${g},${b},${alpha})`
}