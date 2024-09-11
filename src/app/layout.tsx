import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MFA Racing",
  description: "Track a race day",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Create default values for RacerContext from Racer's reducer

  return (
    <html lang="en">
      <body className={ `${inter.className} bg-gray-100`}>

        <div className="ContainerMeat mx-auto w-[390px] bg-white shadow">
          {children}
        </div>

      </body>
    </html>
  );
}
