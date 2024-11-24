'use client'

import { useRef } from "react"
import { useRouter } from "next/navigation"

import styles from '@/components/styles/tile.module.css'

interface TileProps {
  title: string | React.ReactNode,
  subtitle?: string | React.ReactNode,
  className?: string,
  onClick?: () => void,
  children?: React.ReactNode
}

/**
 * Generic tile that underlies all of the other tiles
 * @returns 
 */
export default function Tile({ title, subtitle, className, onClick, children }: TileProps) {
  const _ClickWrapper = ({onClick, children}: {onClick?: ()=>void, children: React.ReactNode}) => (
    onClick
    ? <button onClick={ onClick } className="h-full">{children}</button>
    : children
  )

  return (
    <div className={`tile ${ className }`} >
      <_ClickWrapper onClick={ onClick }>
        <div className="col-2 h-full p-1 justify-center">
          <p className="text-xl font-medium">{ title }</p>
          { subtitle && <small className="">{ subtitle }</small> }
          {children}
        </div>
      </_ClickWrapper>
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

export function VolunteerTile({volunteer, onClick}: {volunteer: VolunteerSchema, onClick?: () => void}) {
  const title =
    volunteer.role === 'Race committee' ? 'RC chair' :
    volunteer.role === 'Volunteer' ? 'RC' :
    volunteer.role === 'Crash boat' ? 'CB' :
    '?'

  return (
    <Tile
      title={ title }
      subtitle={ `${volunteer.name}` }
      onClick={ onClick }
    />
  )
}

/**
 * Tile that displays a race finisher and their position
 * @returns 
 */
export function FinisherTile({finisher, position, onClick}:{finisher: FinisherSchema, position?: number, onClick?: () => void}) {
  const p = position === undefined ? finisher.positionOverride : position

  if (p === undefined) throw new Error("Must provide a finishing position for a <FinisherTile>")

  const pos =
    p === 0 ? '1st' :
    p === 1 ? '2nd' :
    p === 2 ? '3rd' :
    `${p+1}th`

  const bgColor = 
    p === 0 ? 'text-white bg-blue-800' :
    p === 1 ? 'text-white bg-blue-600' :
    p === 2 ? 'text-white bg-blue-400' :
    'bg-gray-300 text-black'

  const _Badge = ({text}:{text:string}) => (
    <div className={`absolute top-[-8px] left-[-8px] rounded-full text-xs w-8 h-8 leading-8 border border-white ${bgColor}`}>
      { text }
    </div>
  )

  return (
    <Tile
      title={ finisher.sailNumber || '?' }
      className="bg-white border-gray-300 shrink-0 mt-2 mr-2 h-auto py-2"
      onClick={onClick}
    >
      <_Badge text={ pos } />
    </Tile>
  )
}

export function FailureTile({racer, onClick}:{racer: FinisherSchema, onClick?: () => void}) {
  return (
    <Tile
      title={ racer.sailNumber || '?' }
      className="bg-white border-gray-300 shrink-0 mt-2 mr-2 h-auto py-2"
      onClick={onClick}
    >
      {/* Position badge */}
      <div className={`absolute border border-white bg-red-500 text-white top-[-8px] left-[-8px] rounded-full text-xs w-12 py-1`}>
        { racer.failure }
      </div>
    </Tile>
  )
}

interface SmartSailorTileProps {
  sailor: RacerSchema | VolunteerSchema | FinisherSchema
  onClick?: () => void
}

export function SmartSailorTile({sailor, onClick}:SmartSailorTileProps) {
  // Finishers have a finishing time
  if ((sailor as FinisherSchema).finishedAt !== undefined)
    return <FinisherTile finisher={sailor as RacerSchema} onClick={onClick} />

  // Failed finishers don't have a finish time, but have failure data
  if ((sailor as FinisherSchema).failure !== undefined)
    return <FailureTile racer={sailor as FinisherSchema} onClick={onClick} />

  // Racers have sail numbers
  if ((sailor as RacerSchema).sailNumber !== undefined)
    return <RacerTile racer={sailor as RacerSchema} onClick={onClick} />

  // Anyone who doesn't fit is a volunteer
  return <VolunteerTile volunteer={sailor as VolunteerSchema} onClick={onClick} />
}

/**
 * A tile that displays a sailor and opens a contextual modal when clicked
 * (for example, to edit the sailor or disqualify the racer)
 * @param sailor The sailor to display
 * @param children The contents of the contextual menu
 * @param className Additional classes to apply to the tile
 * @returns 
 */
export function ModalTile({sailor, children, className}:
  {sailor: RacerSchema | VolunteerSchema | FinisherSchema, children?:React.ReactNode, className?:string}) {
  const dialog = useRef(null)

  // Tile onClick handler
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
      <SmartSailorTile sailor={sailor} onClick={onClick} />

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
