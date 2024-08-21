'use client'

import { useRouter } from "next/navigation"

interface TileProps {
  title: string,
  subtitle: string,
  onClick?: () => void
}

export default function Tile({ title, subtitle, onClick }: TileProps) {
  const ClickablePartial = ({children}: {children: React.ReactNode}) => (
    <button onClick={ onClick }>
      { children }
    </button>
  )

  const ContentPartial = () => (
    <>
      <p>{ title }</p>
      <small>{ subtitle }</small>
    </>
  )

  return (
    <div
      className="border border-black text-center w-[109px]"
    >
      { onClick
        ? <ClickablePartial><ContentPartial /></ClickablePartial>
        : <ContentPartial />
      }
      
    </div>
  )
}

export function NavTile(
  { title, subtitle, href }:
  { title: string, subtitle: string, href: string }
) {
  const router = useRouter()

  return (
    <Tile
      title={title}
      subtitle={subtitle}
      onClick={ () => router.push(href) }
    />
  )
}