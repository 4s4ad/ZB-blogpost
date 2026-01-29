import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"

export default async function NotFound() {
  const t = await getTranslations("errors.404")

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-6xl font-bold text-foreground">{t("title")}</h1>
      <h2 className="text-2xl font-semibold text-foreground">{t("subtitle")}</h2>
      <p className="text-center text-muted-foreground">{t("description")}</p>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/">{t("goHome")}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/blog">{t("browseArticles")}</Link>
        </Button>
      </div>
    </div>
  )
}
