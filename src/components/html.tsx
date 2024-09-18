import { useRouter } from "next/navigation"

type HeadingProps = React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>

function h1({children, ...rest}: HeadingProps) {
  const className = `font-medium ${rest.className}`

  return (
    <h1 className={className}>{ children }</h1>
  )
}

type SmallProps = React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>

function small({children, ...rest}: SmallProps) {
  return (
    <small {...rest}>{ children }</small>
  )
}

/**
 * Displays a <-- Back button
 * @param url optional string URL to push into the Next router
 * @param onClick option click handler that replaces default click behavior
 * @returns 
 */
function back({url, onClick}: {url?: string, onClick?: ()=>void}) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) return onClick()

    url
    ? router.push(url)
    : router.back()
  }

  return (
    <button onClick={handleClick}>&lt;--</button>
  )
}

const HTML = {
  h1, small, back
}

export default HTML