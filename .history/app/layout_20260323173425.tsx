import type React from "react"
import type { Metadata } from "next"
import { Amiri } from "next/font/google"
import "../styles/globals.css"
import "../styles/admin-theme.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { GlobalProvider } from "@/components/global-provider"

const amiri = Amiri({ 
  subsets: ["arabic", "latin"],
  weight: ["400", "700"] // وزن الخط (العادي والعريض)
})

export const metadata: Metadata = {
  title: "بن آسـر",
  description: "بِنْبِيع المَزَاج - أفضل أنواع البن",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={amiri.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <GlobalProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
            <Toaster />
          </GlobalProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
