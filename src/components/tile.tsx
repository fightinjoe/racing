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
    <div className={`tile ${ className }`} >
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
    return <Tile {...props} onClick={ () => router.push(props.href) } className={ props.className || styles.Base } />
  },

  // A tile that has yet to be completed
  // Todo: (props: NavTileProps) => (
  //   <NavTile.Base {...{...props, className: `${props.className} tile-todo`}} />
  // ),

  // Tile to draw attention to, usually together with a Todo banner
  Highlight: (props: NavTileProps) => (
    <NavTile.Base {...{...props, className: `${props.className} ${styles.Highlight}`}} />
  ),

  // Tile that is complete and isn't expected to be revisited
  // e.g. racers once racing has begun
  Done: (props: NavTileProps) => (
    <NavTile.Base {...{...props, className: `${props.className} ${styles.Done}`}} />
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
    position === 0 ? 'text-white bg-blue-800' :
    position === 1 ? 'text-white bg-blue-600' :
    position === 2 ? 'text-white bg-blue-400' :
    'bg-gray-300 text-black'

  return (
    <Tile
      title={ racer.sailNumber || '?' }
      subtitle={ racer.name }
      className="bg-white border-gray-300 shrink-0 mt-2 mr-2"
    >
      {/* Position badge */}
      <div className={`${styles.position} ${bgColor}`}>
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
      className="bg-white border-gray-300 shrink-0 mt-2 mr-2"
    >
      {/* Position badge */}
      <div className={`absolute border border border-white bg-red-500 text-white top-[-8px] left-[-8px] rounded-full text-xs w-12 py-1`}>
        { racer.failure }
      </div>
    </Tile>
  )
}

export function ModalTile({sailor, children, className}:
  {sailor: RacerSchema | VolunteerSchema, children?:React.ReactNode, className?:string}) {
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

  const _RacerTile = () => {
    const racer = sailor as RacerSchema

    return (
      <Tile
        title={ racer.sailNumber || '?' }
        subtitle={ `${racer.name} (${racer.fleet} fleet)` }
        className={`relative ${className}`}
        onClick={ onClick }
      />
    )
  }

  const _VolunteerTile = () => {
    const volunteer = sailor as VolunteerSchema

    const title =
      volunteer.role === 'Race committee' ? 'RC chair' :
      volunteer.role === 'Volunteer' ? 'RC' :
      volunteer.role === 'Crash boat' ? 'CB' :
      '?'

    return (
      <Tile
        title={ title }
        subtitle={ `${volunteer.name}` }
        className={`relative ${className}`}
        onClick={ onClick }
      />
    )
  }

  return (
    <div>
      {
        (sailor as RacerSchema).sailNumber !== undefined
        ? <_RacerTile />
        : <_VolunteerTile />
      }
      <dialog ref={dialog} className={styles.modal} onClick={ onDialogClick }>
        { children }
      </dialog>
    </div>
  ) 
}

// function ModalRacerTile({racer, onClick}: {racer:RacerSchema, onClick: ()=>void}) {
//   return (
//     <Tile
//       title={ racer.sailNumber || '?' }
//       subtitle={ `${sailor.name} (${sailor.fleet} fleet)` }
//       className={`relative ${className}`}
//       onClick={ onClick }
//     />
//   )
// }

const Todo = (props: TileProps) => (
  <Tile {...props} className={styles.Todo+' '+props.className} />
)

export const Tiles = {
  Todo
}
