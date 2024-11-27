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

export interface DefaultTileProps<SailorType = RacerSchema> {
  sailor: SailorType,
  onClick?: () => void,
  className?: string
}

/**
 * Tile that displays a racer
 * @returns 
 */
export function RacerTile({sailor, className, onClick}: DefaultTileProps<RacerSchema> ) {
  return (
    <Tile
      title={ sailor.sailNumber || '?' }
      subtitle={ `${sailor.name} (${sailor.fleet} fleet)` }
      className={`bg-ocean-100 ${className}`}
      onClick={ onClick }
    />
  )
}

export function VolunteerTile({sailor, onClick}: DefaultTileProps<VolunteerSchema> ) {
  const title =
    sailor.role === 'Race committee' ? 'RC chair' :
    sailor.role === 'Volunteer' ? 'RC' :
    sailor.role === 'Crash boat' ? 'CB' :
    '?'

  return (
    <Tile
      title={ title }
      subtitle={ `${sailor.name}` }
      onClick={ onClick }
    />
  )
}

/**
 * Tile that displays a race finisher and their position
 * @returns 
 */
export function FinisherTile({sailor, position, onClick}: DefaultTileProps<FinisherSchema> & {position?: number}) {
  const p = position === undefined ? sailor.positionOverride : position

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

  return (
    <Tile
      title={ sailor.sailNumber || '?' }
      className="bg-white border-gray-300 shrink-0 mt-2 mr-2 h-auto py-2"
      onClick={onClick}
    >
      <TileBadge text={ pos } className={bgColor} />
    </Tile>
  )
}

export function FailureTile({sailor, onClick}: DefaultTileProps<FinisherSchema> ) {
  return (
    <Tile
      title={ sailor.sailNumber || '?' }
      className="bg-white border-gray-300 shrink-0 mt-2 mr-2 h-auto py-2"
      onClick={onClick}
    >
      {/* Position badge */}
      <div className={`absolute border border-white bg-red-500 text-white top-[-8px] left-[-8px] rounded-full text-xs w-12 py-1`}>
        { sailor.failure }
      </div>
    </Tile>
  )
}

type SmartSailorTileProps = DefaultTileProps<RacerSchema | VolunteerSchema | FinisherSchema>

export function SmartSailorTile({sailor, onClick}:SmartSailorTileProps) {
  // Finishers have a finishing time
  if ((sailor as FinisherSchema).finishedAt !== undefined)
    return <FinisherTile sailor={sailor as RacerSchema} onClick={onClick} />

  // Failed finishers don't have a finish time, but have failure data
  if ((sailor as FinisherSchema).failure !== undefined)
    return <FailureTile sailor={sailor as FinisherSchema} onClick={onClick} />

  // Racers have sail numbers
  if ((sailor as RacerSchema).sailNumber !== undefined)
    return <RacerTile sailor={sailor as RacerSchema} onClick={onClick} />

  // Anyone who doesn't fit is a volunteer
  return <VolunteerTile sailor={sailor as VolunteerSchema} onClick={onClick} />
}

interface ModalTileProps<SailorType> {
  sailor: SailorType
  children?: React.ReactNode
  className?: string
  TileRenderer?: React.FC<DefaultTileProps<SailorType>>
}
/**
 * A tile that displays a sailor and opens a contextual modal when clicked
 * (for example, to edit the sailor or disqualify the racer)
 * @param sailor The sailor to display
 * @param children The contents of the contextual menu
 * @param className Additional classes to apply to the tile
 * @returns 
 */
export function ModalTile<T extends RacerSchema | VolunteerSchema | FinisherSchema>({sailor, children, className, TileRenderer = SmartSailorTile}: ModalTileProps<T>) {
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
      <TileRenderer {...{sailor, className, onClick}} />

      <dialog ref={dialog} className={styles.modal} onClick={ onDialogClick }>
        { children }
      </dialog>
    </div>
  ) 
}

export function TileBadge({text, className}:{text:string, className?:string}) {
  return (
    <div className={`absolute top-[-8px] left-[-8px] rounded-full text-xs w-8 h-8 leading-8 border border-white ${className}`}>
        { text }
      </div>
  )
}

const Todo = (props: TileProps) => (
  <Tile {...props} className={styles.Todo+' '+props.className} />
)

export const Tiles = {
  Todo
}
