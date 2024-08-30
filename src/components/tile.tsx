'use client'

import { useRouter } from "next/navigation"

interface TileProps {
  title: string,
  subtitle: string,
  onClick?: () => void,
  children?: React.ReactNode
}

export default function Tile({ title, subtitle, onClick, children }: TileProps) {
  const _ClickWrapper = ({children}: {children: React.ReactNode}) => (
    <button onClick={ onClick }>
      {children}
    </button>
  )

  const _Content = ({children}: {children: React.ReactNode}) => (
    <div>
      <p>{ title }</p>
      <small>{ subtitle }</small>
      {children}
    </div>
  )

  return (
    <div
      className="relative border border-black text-center w-[109px]"
    >
      { onClick
        ? <_ClickWrapper><_Content>{children}</_Content></_ClickWrapper>
        : <_Content>{children}</_Content>
      }
      
    </div>
  )
}

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

export function RacerTile({racer, onClick}: {racer: RacerSchema, onClick?: () => void}) {
  return (
    <Tile
      title={ racer.sailNumber || '?' }
      subtitle={ racer.name }
      onClick={ onClick }
    />
  )
}

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