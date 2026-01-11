import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { ArticleForm } from "@/components/admin/article-form"

export const metadata = {
  title: "Edit Article",
  description: "Edit an existing blog article",
}

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const [article, categories, tags] = await Promise.all([
    db.article.findUnique({
      where: { id },
    }),
    db.category.findMany(),
    db.tag.findMany(),
  ])

  if (!article) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit Article</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update your blog post</p>
      </div>
      <ArticleForm article={article} categories={categories} tags={tags} />
    </div>
  )
}
