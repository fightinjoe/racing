'use client'

import { useReducer } from 'react'
import * as Reducer from '@/state/racersReducer'
import { RacersContext } from '@/state/racersContext'

// import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "MFA Racing",
//   description: "Track a race day",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Create default values for RacerContext from Racer's reducer
  const [racersState, racersDispatch] = useReducer( Reducer.reducer, Reducer.initialValue )
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <RacersContext.Provider value={{racersState, racersDispatch}}>
          {children}
        </RacersContext.Provider>
      </body>
    </html>
  );
}
