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

function back({url}: {url?: string}) {
  const router = useRouter()

  function handleClick() {
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