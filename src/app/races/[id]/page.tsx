'use client'

export default function RacePage({params}: {params: {id: string}}) {
  return (
    <div>
      Single race { params.id }
    </div>
  )
}