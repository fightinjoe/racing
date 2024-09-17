import { useRouter } from "next/navigation"

interface NodeParams {
  className?: string,
  children?: React.ReactNode
}

function h1({className, children}: NodeParams) {

  return (
    <h1 className={`font-medium ${className}`}>{ children }</h1>
  )
}

function small({children}: {children: React.ReactNode}) {
  return (
    <small>{ children }</small>
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