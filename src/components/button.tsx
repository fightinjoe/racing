import styles from "./button.module.css"

type ButtonProps = React.PropsWithChildren<React.HTMLAttributes<HTMLButtonElement>>
type SubmitProps = {
  value: string
}

function Base(props: ButtonProps) {
  return (
    <button {...props}>{props.children}</button>
  )
}

function Submit(props: SubmitProps) {
  return (
    <input {...props} type="submit" className={styles.submit} />
  )
}

function Cancel(props: ButtonProps) {
  const className = styles.cancel + ' ' + props.className

  return (
    <button {...props} className={className}>{props.children || 'Cancel'}</button>
  )
}

function Primary(props: ButtonProps) {
  return <Base {...props} className={styles.primary+' '+props.className} />
}

function Secondary(props: ButtonProps) {
  return <Base {...props} className={styles.secondary+' '+props.className} />
}

const Button = { Cancel, Submit, Primary, Secondary }

export default Button