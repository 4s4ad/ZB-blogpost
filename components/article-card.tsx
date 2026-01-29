"use client"

import { Link } from "@/i18n/navigation"
import Image from "next/image"
import type { ArticleWithRelations } from "@/lib/db"
import { calculateReadingTime } from "@/lib/utils/markdown"
import { useLocale, useTranslations } from "next-intl"

interface ArticleCardProps {
  article: ArticleWithRelations
}

export function ArticleCard({ article }: ArticleCardProps) {
  const readingTime = calculateReadingTime(article.content)
  const locale = useLocale()
  const t = useTranslations("blog")

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col gap-4 rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
    >
      {article.coverImage && (
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image
            src={article.coverImage || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="text-balance text-xl font-semibold leading-tight text-foreground group-hover:text-primary">
          {article.title}
        </h3>
        <p className="text-pretty text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        {article.publishedAt && (
          <time dateTime={article.publishedAt.toISOString()}>
            {new Date(article.publishedAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        )}
        <span>{t("minRead", { count: readingTime })}</span>
        {article.categories.length > 0 && (
          <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">{article.categories[0].name}</span>
        )}
      </div>
    </Link>
  )
}
