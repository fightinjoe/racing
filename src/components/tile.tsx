'use client'

import { useRef } from "react"
import { useRouter } from "next/navigation"

import styles from './tile.module.css'

interface TileProps {
  title: string | React.ReactNode,
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

interface NavTileProps {
  title: string,
  subtitle: string | React.ReactNode,
  href: string,
  className?: string
}

/**
 * Tile used for navigating to another page
 * @returns 
 */
export const NavTile = {
  Base: (props: NavTileProps) => {
    const router = useRouter()
    return <Tile {...props} onClick={ () => router.push(props.href) } />
  },

  Todo: (props: NavTileProps) => (
    <NavTile.Base {...{...props, className: `${props.className} ${styles.Todo}`}} />
  ),

  Highlight: (props: NavTileProps) => (
    <NavTile.Base {...{...props, className: `${props.className} ${styles.Highlight}`}} />
  ),
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
      className="bg-white border-gray-300 shrink-0"
    >
      {/* Position badge */}
      <div className={`absolute ${bgColor} text-white top-[-8px] left-[-8px] rounded-full text-xs w-8 h-8 leading-8`}>
        { pos }
      </div>
    </Tile>
  )
}

export function FailureTile({racer}:{racer: FinisherSchema}) {
  return (
    <Tile
      title={ racer.sailNumber || '?' }
      subtitle={ racer.name }
      className="bg-white border-gray-300 shrink-0"
    >
      {/* Position badge */}
      <div className={`absolute border border-2 border-red-600 bg-red-100 text-red-600 top-[-8px] left-[-8px] rounded-full text-xs w-12 py-1`}>
        { racer.failure }
      </div>
    </Tile>
  )
}

export function ModalTile({racer, children, className}:
  {racer: RacerSchema, children?:React.ReactNode, className?:string}) {
  const dialog = useRef(null)

  const onClick = () => {
    if(!dialog || !dialog.current) return
    
    const modal: HTMLDialogElement = dialog.current
    const tile = modal.parentNode as HTMLDivElement
    const dims = tile.getBoundingClientRect()

    // Position the modal
    modal.style.top = `${ dims.top - 5 }px`
    modal.style.left = `${ dims.left - 5 }px`
    modal.style.width = `${ dims.width + 8 }px`

    // Make the modal appear on the screen
    modal!.showModal()
  }

  const onDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const modal:HTMLDialogElement = dialog!.current!
    modal.close()
  }

  return (
    <div>
      <Tile
        title={ racer.sailNumber || '?' }
        subtitle={ `${racer.name} (${racer.fleet} fleet)` }
        className={`relative ${className}`}
        onClick={ onClick }
      />
      <dialog ref={dialog} className={styles.modal} onClick={ onDialogClick }>
        { children }
      </dialog>
    </div>
  ) 
}

const Todo = (props: TileProps) => (
  <Tile {...props} className={styles.Todo+' '+props.className} />
)

export const Tiles = {
  Todo
}
