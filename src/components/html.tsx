import { useRouter } from "next/navigation"

function h1({title}: {title: string}) {
  return (
    <h1 className="px-4">{ title }</h1>
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
  h1, back
}

export default HTML