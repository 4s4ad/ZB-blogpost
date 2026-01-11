import { ArticleCard } from "@/components/article-card"
import { db } from "@/lib/db"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string; search?: string }>
}) {
  const params = await searchParams
  
  try {
    const articles = await db.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    })

    const categories = await db.category.findMany()

    // Filter articles based on search params
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
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-12 flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-foreground">All Articles</h1>
          <p className="text-lg text-muted-foreground">
            Explore all published articles on technology, design, and development.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
          <form className="flex-1">
            <Input
              type="search"
              name="search"
              placeholder="Search articles..."
              defaultValue={params.search}
              className="max-w-md"
            />
          </form>
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Button asChild variant={!params.category ? "default" : "outline"} size="sm">
            <a href="/blog">All</a>
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              asChild
              variant={params.category === category.slug ? "default" : "outline"}
              size="sm"
            >
              <a href={`/blog?category=${category.slug}`}>{category.name}</a>
            </Button>
          ))}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">No articles found.</p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Error loading blog page:", error)
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-destructive">Error Loading Blog</h1>
        <p className="mt-4 text-muted-foreground">We're having trouble loading the articles. Please try again later.</p>
      </div>
    )
  }
}
