"use client"

import { useState, useActionState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Article } from "@/lib/db"
import { deleteArticleAction } from "@/app/admin/(dashboard)/articles/actions"
import { Pencil, Trash2, Eye } from "lucide-react"

interface ArticlesTableProps {
  articles: Article[]
}

export function ArticlesTable({ articles }: ArticlesTableProps) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all")

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(search.toLowerCase())
    const matchesFilter =
      filter === "all" || (filter === "published" && article.published) || (filter === "draft" && !article.published)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          type="search"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            All
          </Button>
          <Button
            variant={filter === "published" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("published")}
          >
            Published
          </Button>
          <Button variant={filter === "draft" ? "default" : "outline"} size="sm" onClick={() => setFilter("draft")}>
            Drafts
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArticles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No articles found
                </TableCell>
              </TableRow>
            ) : (
              filteredArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/articles/${article.id}/edit`} className="hover:text-primary">
                      {article.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {article.published ? (
                      <Badge variant="default">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(article.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {article.published && (
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/blog/${article.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/articles/${article.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteArticleForm id={article.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function DeleteArticleForm({ id }: { id: string }) {
  const [state, formAction, isPending] = useActionState(deleteArticleAction, undefined)

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <Button
        variant="ghost"
        size="sm"
        type="submit"
        disabled={isPending}
        onClick={(e) => {
          if (!confirm("Are you sure you want to delete this article?")) {
            e.preventDefault()
          }
        }}
      >
        <Trash2 className={cn("h-4 w-4 text-destructive", isPending && "opacity-50")} />
      </Button>
    </form>
  )
}
