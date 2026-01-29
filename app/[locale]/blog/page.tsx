import { ArticleCard } from "@/components/article-card"
import { db } from "@/lib/db"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Search } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string; search?: string }>
}) {
  const params = await searchParams
  const t = await getTranslations("blog")

  try {
    const articles = await db.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    })

    const categories = await db.category.findMany()

    let filteredArticles = articles

    if (params.category) {
      filteredArticles = filteredArticles.filter((article) =>
        article.categories.some((cat) => cat.slug === params.category),
      )
    }

    if (params.tag) {
      filteredArticles = filteredArticles.filter((article) => article.tags.some((tag) => tag.slug === params.tag))
    }

    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredArticles = filteredArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchLower) || article.excerpt.toLowerCase().includes(searchLower),
      )
    }

    return (
      <div className="flex flex-col">
        {/* Header Section */}
        <section className="border-b border-border/40 bg-muted/30">
          <div className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("title")}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                {t("description")}
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="sticky top-16 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto max-w-6xl px-4 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Search */}
              <form className="relative w-full sm:max-w-xs">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  name="search"
                  placeholder={t("searchPlaceholder")}
                  defaultValue={params.search}
                  className="ps-9"
                />
              </form>

              {/* Categories */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  asChild
                  variant={!params.category ? "default" : "ghost"}
                  size="sm"
                  className="h-8"
                >
                  <Link href="/blog">{t("all")}</Link>
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    asChild
                    variant={params.category === category.slug ? "default" : "ghost"}
                    size="sm"
                    className="h-8"
                  >
                    <Link href={`/blog?category=${category.slug}`}>{category.name}</Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="container mx-auto max-w-6xl px-4 py-10 md:py-12">
          {filteredArticles.length > 0 ? (
            <>
              <p className="mb-6 text-sm text-muted-foreground">
                {t("showingArticles", { count: filteredArticles.length, fallback: `${filteredArticles.length} articles` })}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
              <div className="rounded-full bg-muted p-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-foreground">{t("noArticles")}</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                {t("noArticlesDescription", { fallback: "Try adjusting your search or filter to find what you're looking for." })}
              </p>
              {(params.search || params.category) && (
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link href="/blog">{t("clearFilters", { fallback: "Clear filters" })}</Link>
                </Button>
              )}
            </div>
          )}
        </section>
      </div>
    )
  } catch (error) {
    console.error("Error loading blog page:", error)
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-destructive">{t("errorLoading")}</h1>
        <p className="mt-4 max-w-md text-muted-foreground">{t("errorMessage")}</p>
      </div>
    )
  }
}
