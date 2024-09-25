'use client'

import { useRouter } from "next/navigation"
import styles from "./html.module.css"

type HeadingProps = React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>

function H1({children, ...rest}: HeadingProps) {
  const className = `font-medium ${rest.className}`

  return (
    <h1 className={className}>{ children }</h1>
  )
}

type SmallProps = React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>

function Small({children, ...rest}: SmallProps) {
  return (
    <small {...rest}>{ children }</small>
  )
}

type BackProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLButtonElement>
  & { url?: string }
>

/**
 * Displays a <-- Back button
 * @param url optional string URL to push into the Next router
 * @param onClick option click handler that replaces default click behavior
 * @returns 
 */
function Back({url, ...props}: BackProps) {
  const router = useRouter()

  const className = [styles.Back, props.className].join(' ')

  const handleClick: typeof props.onClick = (e) => {
    if (props.onClick) return props.onClick(e)

    url
    ? router.push(url)
    : router.back()
  }

  return (
    <button
      onClick={handleClick}
      className={className}
    >
      <span>&lt;--</span>
      { props.children }
    </button>
  )
}

type HeaderProps = React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>
function Header(props: HeaderProps) {
  const className = [styles.Header, props.className].join(' ')

  return (
    <header {...props} className={className}>
      { props.children }
    </header>
  )
}

const HTML = {
  H1, Small, Back, Header
}

export default HTML