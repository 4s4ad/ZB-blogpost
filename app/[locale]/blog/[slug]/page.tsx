import { notFound } from "next/navigation"
import Image from "next/image"
import { db } from "@/lib/db"
import { calculateReadingTime } from "@/lib/utils/markdown"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { getTranslations, getLocale } from "next-intl/server"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const t = await getTranslations({ locale, namespace: "article" })

  try {
    const article = await db.article.findUnique({
      where: { slug: slug },
    })

    if (!article || !article.published) {
      return {
        title: t("notFound"),
      }
    }

    return {
      title: article.title,
      description: article.excerpt,
      openGraph: {
        title: article.title,
        description: article.excerpt,
        images: article.coverImage ? [article.coverImage] : [],
      },
    }
  } catch (error) {
    console.error(`Error generating metadata for slug: ${slug}`, error)
    return {
      title: t("errorOccurred"),
    }
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = await params
  const t = await getTranslations("blog")
  const locale = await getLocale()

  try {
    const article = await db.article.findUnique({
      where: { slug: slug },
    })

    if (!article || !article.published) {
      notFound()
    }

    const author = await db.user.findUnique({
      where: { id: article.authorId },
    })

    const readingTime = calculateReadingTime(article.content)

    return (
      <article className="container mx-auto max-w-4xl px-4 py-12">
        {/* Article Header */}
        <div className="mb-8 flex flex-col gap-4">
          <Button asChild variant="ghost" size="sm" className="w-fit">
            <Link href="/blog" className="flex items-center gap-1">
              <span className="rtl:rotate-180">←</span> {t("backToBlog")}
            </Link>
          </Button>
          <h1 className="text-balance text-4xl font-bold leading-tight text-foreground md:text-5xl">{article.title}</h1>
          <p className="text-pretty text-xl text-muted-foreground">{article.excerpt}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{author?.name}</span>
            {article.publishedAt && (
              <time dateTime={article.publishedAt.toISOString()}>
                {new Date(article.publishedAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            )}
            <span>{t("minRead", { count: readingTime })}</span>
          </div>
          {/* Categories and Tags */}
          <div className="flex flex-wrap gap-2">
            {article.categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog?category=${category.slug}`}
                className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary hover:bg-primary/20"
              >
                {category.name}
              </Link>
            ))}
            {article.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog?tag=${tag.slug}`}
                className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground hover:bg-muted/80"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-lg">
            <Image src={article.coverImage || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
          </div>
        )}

        {/* Article Content */}
        <div className="mb-12">
          <MarkdownRenderer content={article.content} />
        </div>

        {/* Back to Blog */}
        <div className="border-t border-border pt-8">
          <Button asChild variant="outline">
            <Link href="/blog" className="flex items-center gap-1">
              <span className="rtl:rotate-180">←</span> {t("backToAllArticles")}
            </Link>
          </Button>
        </div>
      </article>
    )
  } catch (error) {
    console.error(`Error loading article page for slug: ${slug}`, error)
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-destructive">{t("errorLoadingArticle")}</h1>
        <p className="mt-4 text-muted-foreground">{t("errorMessageArticle")}</p>
        <Button asChild className="mt-8" variant="outline">
          <Link href="/blog">{t("backToBlog")}</Link>
        </Button>
      </div>
    )
  }
}
