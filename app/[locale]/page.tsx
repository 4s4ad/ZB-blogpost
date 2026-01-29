import { Button } from "@/components/ui/button"
import { ArticleCard } from "@/components/article-card"
import { db } from "@/lib/db"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const t = await getTranslations("home")

  try {
    const latestArticles = await db.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    })

    return (
      <div className="flex min-h-screen flex-col">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center gap-6 px-4 py-24 text-center md:py-32">
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
            {t("welcome")}
          </h1>
          <p className="max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            {t("description")}
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/blog">{t("readArticles")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">{t("aboutMe")}</Link>
            </Button>
          </div>
        </section>

        {/* Latest Articles */}
        <section className="container mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-foreground">{t("latestArticles")}</h2>
            <Button asChild variant="ghost">
              <Link href="/blog">{t("viewAll")}</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      </div>
    )
  } catch (error) {
    console.error("Error loading home page articles:", error)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold">{t("welcome")}</h1>
        <p className="mt-4 text-muted-foreground">{t("errorLoading")}</p>
        <Button asChild className="mt-8">
          <Link href="/blog">{t("goToBlog")}</Link>
        </Button>
      </div>
    )
  }
}
