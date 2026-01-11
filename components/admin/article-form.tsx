"use client"

import { useActionState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createArticleAction, updateArticleAction } from "@/app/admin/(dashboard)/articles/actions"
import type { ArticleWithRelations } from "@/lib/db"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { Checkbox } from "@/components/ui/checkbox"

interface ArticleFormProps {
  article?: ArticleWithRelations
  categories: any[]
  tags: any[]
}

export function ArticleForm({ article, categories, tags }: ArticleFormProps) {
  const [content, setContent] = useState(article?.content || "")
  const [published, setPublished] = useState(article?.published || false)
  const action = article ? updateArticleAction : createArticleAction
  const [state, formAction, isPending] = useActionState(action, undefined)

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    article?.categories?.map((c) => c.id) || []
  )
  const [selectedTags, setSelectedTags] = useState<string[]>(
    article?.tags?.map((t) => t.id) || []
  )

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {article && <input type="hidden" name="id" value={article.id} />}
      
      {/* Hidden inputs for multi-select values to be captured by FormData */}
      {selectedCategories.map((id) => (
        <input key={id} type="hidden" name="categoryIds" value={id} />
      ))}
      {selectedTags.map((id) => (
        <input key={id} type="hidden" name="tagIds" value={id} />
      ))}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={article?.title} required placeholder="Enter article title" />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  defaultValue={article?.excerpt}
                  required
                  placeholder="Brief summary of the article"
                  rows={3}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  name="coverImage"
                  type="url"
                  defaultValue={article?.coverImage || ""}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="coverImageFile">Or Upload from Computer</Label>
                <Input
                  id="coverImageFile"
                  name="coverImageFile"
                  type="file"
                  accept="image/*"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="edit">
                <TabsList>
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="edit" className="mt-4">
                  <Textarea
                    id="content"
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    placeholder="Write your article in Markdown..."
                    rows={20}
                    className="font-mono bg-muted/30 focus-visible:ring-primary"
                  />
                </TabsContent>
                <TabsContent value="preview" className="mt-4">
                  <div className="rounded-md border border-border p-6 bg-card min-h-[500px]">
                    <MarkdownRenderer content={content} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="published">Status</Label>
                  <p className="text-xs text-muted-foreground">{published ? "Published" : "Draft"}</p>
                </div>
                <Switch id="published" name="published" checked={published} onCheckedChange={setPublished} />
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Saving..." : article ? "Update Article" : "Create Article"}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => window.history.back()}>
                Cancel
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <label
                      htmlFor={`cat-${category.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag.id}`}
                      checked={selectedTags.includes(tag.id)}
                      onCheckedChange={() => toggleTag(tag.id)}
                    />
                    <label
                      htmlFor={`tag-${tag.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {tag.name}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
