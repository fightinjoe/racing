'use client'

import { useRouter } from "next/navigation"

interface TileProps {
  title: string,
  subtitle: string,
  onClick?: () => void,
  children?: React.ReactNode
}

/**
 * Generic tile that underlies all of the other tiles
 * @returns 
 */
export default function Tile({ title, subtitle, onClick, children }: TileProps) {
  const _ClickWrapper = ({children}: {children: React.ReactNode}) => (
    <button onClick={ onClick } className="h-full">
      {children}
    </button>
  )

  const _Content = ({children}: {children: React.ReactNode}) => (
    <div className="col-2 h-full p-1 justify-center">
      <p className="text-xl font-medium">{ title }</p>
      <small className="">{ subtitle }</small>
      {children}
    </div>
  )

  return (
    <div
      className="Tile relative border border-black text-center rounded"
    >
      { onClick
        ? <_ClickWrapper><_Content>{children}</_Content></_ClickWrapper>
        : <_Content>{children}</_Content>
      }
      
    </div>
  )
}

/**
 * Tile used for navigating to another page
 * @returns 
 */
export function NavTile(
  { title, subtitle, href }:
  { title: string, subtitle: string, href: string }
) {
  const router = useRouter()

  return (
    <Tile
      title={title}
      subtitle={subtitle}
      onClick={ () => router.push(href) }
    />
  )
}

/**
 * Tile that displays a racer
 * @returns 
 */
export function RacerTile({racer, onClick}: {racer: RacerSchema, onClick?: () => void}) {
  return (
    <Tile
      title={ racer.sailNumber || '?' }
      subtitle={ racer.name }
      onClick={ onClick }
    />
  )
}

/**
 * Tile that displays a race finisher and their position
 * @returns 
 */
export function FinisherTile({racer, position}:{racer: RacerSchema, position: number}) {
  const pos =
    position === 0 ? '1st' :
    position === 1 ? '2nd' :
    position === 2 ? '3rd' :
    `${position+1}th`

  return (
    <Tile
      title={ racer.sailNumber || '?' }
      subtitle={ racer.name }
    >
      {/* Position badge */}
      <div className="absolute bg-blue-800 text-white top-[-6px] left-[-6px] rounded text-[10px] p-1">
        { pos }
      </div>
    </Tile>
  )
}