import styles from "./button.module.css"

type ButtonProps = React.PropsWithChildren<React.HTMLAttributes<HTMLButtonElement>>
type SubmitProps = {
  value: string
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

const Button = { Cancel, Submit }

export default Button