import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

import styles from "./layout.module.css"

export const metadata: Metadata = {
  title: "MFA Racing",
  description: "Track a race day",
};

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({children}: RootLayoutProps): React.ReactNode {
  return (
    <html lang="en">
      <body className={ `${inter.className} ${styles.body}`}>

        <div className={`ContainerMeat ${ styles.wrapper }`}>
          {children}
        </div>

      </body>
    </html>
  );
}
