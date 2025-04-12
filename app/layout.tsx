import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "./providers"
import { DebateProvider } from "@/lib/contexts/DebateContext"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DebateBolt - Modern Debate Platform",
  description: "Real-time debate platform with WebRTC and AI opponents",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.className} noise-bg`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <DebateProvider>
            <Providers>{children}</Providers>
          </DebateProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'