"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { generateSlug } from "@/lib/utils/markdown"
import { getSession } from "@/lib/session"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function createArticleAction(prevState: any, formData: FormData) {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string
  const excerpt = formData.get("excerpt") as string
  const content = formData.get("content") as string
  const coverImage = formData.get("coverImage") as string
  const coverImageFile = formData.get("coverImageFile") as File
  const published = formData.get("published") === "on"
  
  const categoryIds = formData.getAll("categoryIds") as string[]
  const tagIds = formData.getAll("tagIds") as string[]

  let finalCoverImage = coverImage || undefined

  if (coverImageFile && coverImageFile.size > 0) {
    const bytes = await coverImageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const extension = coverImageFile.name.split(".").pop()
    const fileName = `${uuidv4()}.${extension}`
    const path = join(process.cwd(), "public", "uploads", fileName)
    
    await writeFile(path, buffer)
    finalCoverImage = `/uploads/${fileName}`
  }

  const slug = generateSlug(title)

  const article = await db.article.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImage: finalCoverImage,
      published,
      publishedAt: published ? new Date() : undefined,
      authorId: session.userId,
      categoryIds,
      tagIds,
    },
  })

  revalidatePath("/admin/articles")
  revalidatePath("/blog")
  redirect(`/admin/articles/${article.id}/edit`)
}

export async function updateArticleAction(prevState: any, formData: FormData) {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }

  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const excerpt = formData.get("excerpt") as string
  const content = formData.get("content") as string
  const coverImage = formData.get("coverImage") as string
  const coverImageFile = formData.get("coverImageFile") as File
  const published = formData.get("published") === "on"
  
  const categoryIds = formData.getAll("categoryIds") as string[]
  const tagIds = formData.getAll("tagIds") as string[]

  const article = await db.article.findUnique({ where: { id } })

  let finalCoverImage = coverImage || article?.coverImage || undefined

  if (coverImageFile && coverImageFile.size > 0) {
    const bytes = await coverImageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const extension = coverImageFile.name.split(".").pop()
    const fileName = `${uuidv4()}.${extension}`
    const path = join(process.cwd(), "public", "uploads", fileName)
    
    await writeFile(path, buffer)
    finalCoverImage = `/uploads/${fileName}`
  }

  await db.article.update({
    where: { id },
    data: {
      title,
      excerpt,
      content,
      coverImage: finalCoverImage,
      published,
      publishedAt: published && !article?.published ? new Date() : article?.publishedAt,
      categoryIds,
      tagIds,
    },
  })

  revalidatePath("/admin/articles")
  revalidatePath("/blog")
  revalidatePath(`/blog/${article?.slug}`)
  redirect("/admin/articles")
}

export async function deleteArticleAction(prevState: any, formData: FormData) {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }

  const id = formData.get("id") as string

  await db.article.delete({ where: { id } })

  revalidatePath("/admin/articles")
  revalidatePath("/blog")
}

export async function togglePublishAction(prevState: any, formData: FormData) {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }

  const id = formData.get("id") as string
  const article = await db.article.findUnique({ where: { id } })

  if (!article) {
    throw new Error("Article not found")
  }

  await db.article.update({
    where: { id },
    data: {
      published: !article.published,
      publishedAt: !article.published ? new Date() : article.publishedAt,
    },
  })

  revalidatePath("/admin/articles")
  revalidatePath("/blog")
}
