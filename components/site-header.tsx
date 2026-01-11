import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">MyBlog</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
            Home
          </Link>
          <Link href="/blog" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
            Blog
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
          >
            About
          </Link>
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/login">Admin</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
