'use client'

import { useRouter } from "next/navigation"

interface TileProps {
  title: string,
  subtitle: string | React.ReactNode,
  className?: string,
  onClick?: () => void,
  children?: React.ReactNode
}

/**
 * Generic tile that underlies all of the other tiles
 * @returns 
 */
export default function Tile({ title, subtitle, className, onClick, children }: TileProps) {
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
      className={`Tile relative text-center rounded ${ className }`}
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
  { title, subtitle, href, className }:
  { title: string, subtitle: string | React.ReactNode, href: string, className?: string }
) {
  const router = useRouter()

  return (
    <Tile
      title={title}
      subtitle={subtitle}
      className={`bg-white ${className}`}
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
      subtitle={ `${racer.name} (${racer.fleet} fleet)` }
      className="bg-ocean-100"
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

  const bgColor = 
    position === 0 ? 'bg-blue-800' :
    position === 1 ? 'bg-blue-600' :
    position === 2 ? 'bg-blue-400' :
    'bg-gray-300 text-black'

  return (
    <Tile
      title={ racer.sailNumber || '?' }
      subtitle={ racer.name }
      className="bg-white border-gray-300"
    >
      {/* Position badge */}
      <div className={`absolute ${bgColor} text-white top-[-8px] left-[-8px] rounded-full text-xs w-8 h-8 leading-8`}>
        { pos }
      </div>
    </Tile>
  )
}