"use client"

import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslations } from "next-intl"

export function SiteHeader() {
  const t = useTranslations("navigation")
  const tCommon = useTranslations("common")

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">{tCommon("siteName")}</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
            {t("home")}
          </Link>
          <Link href="/blog" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
            {t("blog")}
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
          >
            {t("about")}
          </Link>
          <LanguageSwitcher />
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <a href="/admin/login">{t("admin")}</a>
          </Button>
        </nav>
      </div>
    </header>
  )
}
