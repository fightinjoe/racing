import { useEffect, useState } from "react"
import { printDuration } from "@/lib/printer"

export function Timer({ start = Date.now() }: {start: number}) {
  const [time, setTime] = useState<number>( Date.now() )

  useEffect(() => {
    const interval = setInterval( () => setTime(Date.now()), 1000 )

    return () => clearInterval(interval)
  })

  return <Duration start={start} finish={ time } />
}

export function Duration({ start, finish = Date.now() }: {start:number, finish:number}) {
  return (
    <div>{ printDuration(start, finish) }</div>
  )
}