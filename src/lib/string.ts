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