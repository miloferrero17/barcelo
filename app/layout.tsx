import type React from "react"
import type { Metadata } from "next"
import { Inter, Oswald } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald", weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  title: "Fundación Barceló Rugby - Rugby, Universidad y Comunidad",
  description: "Club de rugby argentino. Formamos jugadores y personas comprometidas con el deporte y la comunidad.",
  generator: "v0.app",
  icons: {
    icon: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${oswald.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
