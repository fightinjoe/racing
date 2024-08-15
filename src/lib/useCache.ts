/**
 * Use the hook to wrap an existing method so that whenever the new
 * method is called, it is saved to the KEY value in local storage
 * @param method The method to wrap
 * @param key The unique key to reference the output
 * @returns Output of the wrapped method
 * @example
 *   const addRacer = (state, racer) => ([...state, racer])
 *   const [setRacer, getRacer] = useCache(addRacer, 'racers')
 * 
 *   // Calls addRacer() and then saves the output in window.localStorage.racers
 *   addRacerAndCache(myRacer)
 */
export default function useCache(method:any, key:string, initialValue:any) {
  const setter = function() {
    const out = method.apply(null, arguments)
    window.localStorage[key] = JSON.stringify(out)
    return out
  }

  const getter = function() {
    return window.localStorage[key]
      ? JSON.parse(window.localStorage[key])
      : initialValue
  }

  return [setter, getter]
}