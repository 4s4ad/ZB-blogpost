import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArticlesTable } from "@/components/admin/articles-table"

export const metadata = {
  title: "Articles",
  description: "Manage your blog articles",
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { filter?: string; search?: string }
}) {
  let articles = await db.article.findMany({
    orderBy: { createdAt: "desc" },
  })

  // Apply filters
  if (searchParams.filter === "published") {
    articles = articles.filter((a) => a.published)
  } else if (searchParams.filter === "draft") {
    articles = articles.filter((a) => !a.published)
  }

  if (searchParams.search) {
    const searchLower = searchParams.search.toLowerCase()
    articles = articles.filter((a) => a.title.toLowerCase().includes(searchLower))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Articles</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage all your blog articles</p>
        </div>
        <Button asChild>
          <Link href="/admin/articles/new">Create Article</Link>
        </Button>
      </div>

      <ArticlesTable articles={articles} />
    </div>
  )
}
