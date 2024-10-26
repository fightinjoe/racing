import { RaceDay } from "@/models/raceday"
import useModalTray from "@/components/useModalTray"
import HTML from "@/components/html"
import CourseChooser from "@/components/courseChooser"

import buttonStyles from "@/components/styles/button.module.css"
import raceStyles from "@/components/styles/race.module.css"

type ButtonProps = React.PropsWithChildren<React.HTMLAttributes<HTMLButtonElement>>
type SubmitProps = {
  value: string,
  className?: string
}

function Base(props: ButtonProps) {
  return (
    <button {...props}>{props.children}</button>
  )
}

function Submit(props: SubmitProps) {
  const className = `${buttonStyles.submit} ${props.className || ''}`
  return (
    <input {...props} type="submit" className={className} />
  )
}

function Cancel(props: ButtonProps) {
  const className = buttonStyles.cancel + ' ' + props.className

  return (
    <button {...props} type="button" className={className}>{props.children || 'Cancel'}</button>
  )
}

function Primary(props: ButtonProps) {
  return <Base {...props} className={buttonStyles.primary+' '+props.className} />
}

function Secondary(props: ButtonProps) {
  return <Base {...props} className={buttonStyles.secondary+' '+props.className} />
}

interface StartRaceButtonProps {
  fleet: FleetSchema|undefined
  raceDay: RaceDay
}

export function StartRaceButton({fleet, raceDay}: StartRaceButtonProps) {
  const nextRaceCount = raceDay.races(fleet).length + 1

  const courseModal = useModalTray({})

  return(
    <>
      <button
        className={ raceStyles.startRace }
        onClick={ () => courseModal.props.show() }
      >
        <HTML.H1>Start race  { `${nextRaceCount}${fleet || ''}` }</HTML.H1>
        <HTML.Small>{fleet || 'Combined'} fleet</HTML.Small>
      </button>

      <courseModal.Tray {...courseModal.props} className="max-w-[390px] flex flex-row items-center">
        <CourseChooser fleet={fleet} count={nextRaceCount} onCancel={ courseModal.props.hide } />
      </courseModal.Tray>
    </>
  )
}

const Button = { Cancel, Submit, Primary, Secondary }

export default Button