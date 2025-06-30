import type React from "react"
import type { Metadata } from "next"
import { roboto } from "./fonts"
import { ThemeProvider } from "@/hooks/use-theme"
import { NotificationProvider } from "@/components/notification-system"
import "./globals.css"

export const metadata: Metadata = {
  title: "Telegram Mini App",
  description: "Telegram Mini App with chat, analytics, and tools",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={roboto.variable}>
      <body>
        <ThemeProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
