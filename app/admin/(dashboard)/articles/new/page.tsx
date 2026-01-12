import { ArticleForm } from "@/components/admin/article-form"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Create Article",
  description: "Create a new blog article",
}

export default async function NewArticlePage() {
  const categories = await db.category.findMany()
  const tags = await db.tag.findMany()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create Article</h1>
        <p className="mt-1 text-sm text-muted-foreground">Write a new blog post</p>
      </div>
      <ArticleForm categories={categories} tags={tags} />
    </div>
  )
}
