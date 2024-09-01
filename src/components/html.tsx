import { useRouter } from "next/navigation"

function h1({title}: {title: string}) {
  return (
    <h1 className="">{ title }</h1>
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