import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "MyBlog - Modern Web Development Insights",
    template: "%s | MyBlog",
  },
  description:
    "A personal blog about technology, design, and web development. Sharing insights and experiences from the world of modern software development.",
  generator: "v0.app",
  keywords: ["blog", "web development", "technology", "design", "Next.js", "React", "TypeScript"],
  authors: [{ name: "Admin User" }],
  creator: "Admin User",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://myblog.com",
    title: "MyBlog - Modern Web Development Insights",
    description: "A personal blog about technology, design, and web development.",
    siteName: "MyBlog",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyBlog",
    description: "A personal blog about technology, design, and web development.",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
