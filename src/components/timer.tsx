import { useEffect, useState } from "react"
import { printDuration } from "@/lib/printer"

export function Timer({ start = Date.now() }: {start: number}) {
  const [time, setTime] = useState<string>('0:00:00')

  useEffect(() => {
    const interval = setInterval( updateTime, 1000 )

    return () => clearInterval(interval)
  })

  const updateTime = () => {
    setTime( printDuration(start) )
  }

  return (
    <div>{ time }</div>
  )
}