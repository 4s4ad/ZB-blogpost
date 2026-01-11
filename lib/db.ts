import { PrismaClient } from '@prisma/client'
import path from 'path'

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL || "file:./dev.db"
  
  // If we are on Vercel, we use the default Prisma SQLite driver
  // which is more compatible with the serverless environment
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    return new PrismaClient()
  }

  // In local development, we use better-sqlite3 for performance
  try {
    const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
    let dbPath = url.startsWith("file:") ? url.slice(5) : url
    
    if (!path.isAbsolute(dbPath)) {
      dbPath = path.join(process.cwd(), dbPath)
    }
    
    const adapter = new PrismaBetterSqlite3({ url: dbPath })
    return new PrismaClient({ adapter })
  } catch (e) {
    console.warn("Could not load better-sqlite3 adapter, falling back to default driver:", e)
    return new PrismaClient()
  }
}

const globalForPrisma = global as unknown as { prisma: ReturnType<typeof prismaClientSingleton> }

export const prisma = globalForPrisma.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Export types for convenience
export type { User, Article, Category, Tag } from '@prisma/client'

// Article with relations type
export type ArticleWithRelations = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string | null
  published: boolean
  publishedAt: Date | null
  authorId: string
  createdAt: Date
  updatedAt: Date
  categories: Array<{ id: string; name: string; slug: string }>
  tags: Array<{ id: string; name: string; slug: string }>
}

// Helper function to get articles with their relations
export async function getArticlesWithRelations(options: {
  where?: {
    published?: boolean
    slug?: string
    id?: string
  }
  orderBy?: {
    publishedAt?: 'desc' | 'asc'
    createdAt?: 'desc' | 'asc'
  }
  take?: number
  skip?: number
}): Promise<ArticleWithRelations[]> {
  const articles = await prisma.article.findMany({
    where: options.where as any,
    orderBy: options.orderBy as any,
    take: options.take,
    skip: options.skip,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })

  // Transform the data to match the expected format
  return articles.map((article) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    coverImage: article.coverImage,
    published: article.published,
    publishedAt: article.publishedAt,
    authorId: article.authorId,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    categories: article.categories.map((ac) => ac.category),
    tags: article.tags.map((at) => at.tag),
  }))
}

// Helper function to get a single article with relations
export async function getArticleWithRelations(where: {
  id?: string
  slug?: string
}): Promise<ArticleWithRelations | null> {
  const article = await prisma.article.findUnique({
    where: where as any,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })

  if (!article) return null

  // Transform the data to match the expected format
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    coverImage: article.coverImage,
    published: article.published,
    publishedAt: article.publishedAt,
    authorId: article.authorId,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    categories: article.categories.map((ac) => ac.category),
    tags: article.tags.map((at) => at.tag),
  }
}

// Create article with categories and tags
export async function createArticleWithRelations(data: {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  published: boolean
  publishedAt?: Date
  authorId: string
  categoryIds?: string[]
  tagIds?: string[]
}) {
  const { categoryIds, tagIds, ...articleData } = data

  const article = await prisma.article.create({
    data: {
      ...articleData,
      categories: categoryIds && categoryIds.length > 0
        ? {
            create: categoryIds.map((categoryId) => ({
              category: { connect: { id: categoryId } },
            })),
          }
        : undefined,
      tags: tagIds && tagIds.length > 0
        ? {
            create: tagIds.map((tagId) => ({
              tag: { connect: { id: tagId } },
            })),
          }
        : undefined,
    },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    coverImage: article.coverImage,
    published: article.published,
    publishedAt: article.publishedAt,
    authorId: article.authorId,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    categories: article.categories.map((ac) => ac.category),
    tags: article.tags.map((at) => at.tag),
  }
}

// Update article with categories and tags
export async function updateArticleWithRelations(
  id: string,
  data: {
    title?: string
    slug?: string
    excerpt?: string
    content?: string
    coverImage?: string
    published?: boolean
    publishedAt?: Date
    categoryIds?: string[]
    tagIds?: string[]
  }
) {
  const { categoryIds, tagIds, ...articleData } = data

  // If categories or tags are provided, we need to update them
  if (categoryIds !== undefined) {
    // Delete existing category relations
    await prisma.articleCategory.deleteMany({
      where: { articleId: id },
    })
    // Create new category relations
    if (categoryIds.length > 0) {
      // Use createMany if supported or multiple creates
      // For SQLite, multiple creates might be safer or use a loop if createMany has issues with relations
      for (const categoryId of categoryIds) {
          await prisma.articleCategory.create({
              data: {
                  articleId: id,
                  categoryId
              }
          })
      }
    }
  }

  if (tagIds !== undefined) {
    // Delete existing tag relations
    await prisma.articleTag.deleteMany({
      where: { articleId: id },
    })
    // Create new tag relations
    if (tagIds.length > 0) {
        for (const tagId of tagIds) {
            await prisma.articleTag.create({
                data: {
                    articleId: id,
                    tagId
                }
            })
        }
    }
  }

  // Update the article
  const article = await prisma.article.update({
    where: { id },
    data: articleData as any,
    include: {
      categories: {
        include: {
          category: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    coverImage: article.coverImage,
    published: article.published,
    publishedAt: article.publishedAt,
    authorId: article.authorId,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    categories: article.categories.map((ac) => ac.category),
    tags: article.tags.map((at) => at.tag),
  }
}

// Backward compatibility - export db object with same interface as mock
export const db = {
  user: {
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      return prisma.user.findUnique({ where: where as any })
    },
  },
  article: {
    findMany: async (options: {
      where?: { published?: boolean; slug?: string }
      orderBy?: { publishedAt?: 'desc' | 'asc'; createdAt?: 'desc' | 'asc' }
      take?: number
      skip?: number
    } = {}) => {
      return getArticlesWithRelations(options)
    },
    findUnique: async ({ where }: { where: { id?: string; slug?: string } }) => {
      return getArticleWithRelations(where)
    },
    create: async ({ data }: { data: any }) => {
      return createArticleWithRelations(data)
    },
    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      return updateArticleWithRelations(where.id, data)
    },
    delete: async ({ where }: { where: { id: string } }) => {
      const article = await prisma.article.delete({ where })
      return article
    },
    count: async ({ where }: { where?: { published?: boolean } } = {}) => {
      return prisma.article.count({ where: where as any })
    },
  },
  category: {
    findMany: async () => prisma.category.findMany(),
    findUnique: async ({ where }: { where: { id?: string; slug?: string } }) => {
      return prisma.category.findUnique({ where: where as any })
    },
  },
  tag: {
    findMany: async () => prisma.tag.findMany(),
    findUnique: async ({ where }: { where: { id?: string; slug?: string } }) => {
      return prisma.tag.findUnique({ where: where as any })
    },
  },
}
