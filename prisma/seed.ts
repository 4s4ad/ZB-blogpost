import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, 'dev.db')
const adapter = new PrismaBetterSqlite3({ url: dbPath })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const user = await prisma.user.upsert({
    where: { email: 'admin@blog.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@blog.com',
      password: '$2a$10$YourHashedPasswordHere', // 'password123' hashed
      role: 'ADMIN',
    },
  })
  console.log('✅ Created user:', user.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: { name: 'Technology', slug: 'technology' },
    }),
    prisma.category.upsert({
      where: { slug: 'design' },
      update: {},
      create: { name: 'Design', slug: 'design' },
    }),
    prisma.category.upsert({
      where: { slug: 'development' },
      update: {},
      create: { name: 'Development', slug: 'development' },
    }),
  ])
  console.log('✅ Created categories:', categories.map((c) => c.name).join(', '))

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: { name: 'React', slug: 'react' },
    }),
    prisma.tag.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: { name: 'Next.js', slug: 'nextjs' },
    }),
    prisma.tag.upsert({
      where: { slug: 'typescript' },
      update: {},
      create: { name: 'TypeScript', slug: 'typescript' },
    }),
    prisma.tag.upsert({
      where: { slug: 'ui-ux' },
      update: {},
      create: { name: 'UI/UX', slug: 'ui-ux' },
    }),
  ])
  console.log('✅ Created tags:', tags.map((t) => t.name).join(', '))

  // Create articles
  const article1 = await prisma.article.upsert({
    where: { slug: 'getting-started-with-nextjs-15' },
    update: {},
    create: {
      title: 'Getting Started with Next.js 15',
      slug: 'getting-started-with-nextjs-15',
      excerpt: 'Learn how to build modern web applications with the latest version of Next.js.',
      content: `# Getting Started with Next.js 15

Next.js 15 brings exciting new features and improvements to the React framework.

## What's New

- Improved performance
- Better developer experience
- Enhanced routing capabilities

## Getting Started

\`\`\`bash
npx create-next-app@latest
\`\`\`

Start building your next project with Next.js today!`,
      coverImage: '/modern-web-development.png',
      published: true,
      publishedAt: new Date('2024-12-01'),
      authorId: user.id,
    },
  })

  // Connect categories and tags to article1
  await prisma.articleCategory.deleteMany({ where: { articleId: article1.id } })
  await prisma.articleCategory.create({
    data: { articleId: article1.id, categoryId: categories[0].id }, // Technology
  })
  await prisma.articleCategory.create({
    data: { articleId: article1.id, categoryId: categories[2].id }, // Development
  })

  await prisma.articleTag.deleteMany({ where: { articleId: article1.id } })
  await prisma.articleTag.create({
    data: { articleId: article1.id, tagId: tags[1].id }, // Next.js
  })
  await prisma.articleTag.create({
    data: { articleId: article1.id, tagId: tags[2].id }, // TypeScript
  })

  console.log('✅ Created article:', article1.title)

  const article2 = await prisma.article.upsert({
    where: { slug: 'future-of-web-design' },
    update: {},
    create: {
      title: 'The Future of Web Design',
      slug: 'future-of-web-design',
      excerpt: 'Exploring upcoming trends and innovations in web design for 2025.',
      content: `# The Future of Web Design

Web design is evolving rapidly with new technologies and user expectations.

## Key Trends

1. **AI-Powered Design Tools**
2. **Immersive 3D Experiences**
3. **Sustainable Design Practices**

Design is not just about aesthetics, it's about creating meaningful experiences.`,
      coverImage: '/futuristic-web-design.jpg',
      published: true,
      publishedAt: new Date('2024-11-25'),
      authorId: user.id,
    },
  })

  await prisma.articleCategory.deleteMany({ where: { articleId: article2.id } })
  await prisma.articleCategory.create({
    data: { articleId: article2.id, categoryId: categories[1].id }, // Design
  })

  await prisma.articleTag.deleteMany({ where: { articleId: article2.id } })
  await prisma.articleTag.create({
    data: { articleId: article2.id, tagId: tags[3].id }, // UI/UX
  })

  console.log('✅ Created article:', article2.title)

  const article3 = await prisma.article.upsert({
    where: { slug: 'building-scalable-react-applications' },
    update: {},
    create: {
      title: 'Building Scalable React Applications',
      slug: 'building-scalable-react-applications',
      excerpt: 'Best practices for architecting large-scale React applications.',
      content: `# Building Scalable React Applications

Learn how to structure your React applications for growth.

## Architecture Patterns

- Component composition
- State management strategies
- Performance optimization

This is a draft article that needs more content.`,
      published: false,
      authorId: user.id,
    },
  })

  await prisma.articleCategory.deleteMany({ where: { articleId: article3.id } })
  await prisma.articleCategory.create({
    data: { articleId: article3.id, categoryId: categories[2].id }, // Development
  })

  await prisma.articleTag.deleteMany({ where: { articleId: article3.id } })
  await prisma.articleTag.create({
    data: { articleId: article3.id, tagId: tags[0].id }, // React
  })
  await prisma.articleTag.create({
    data: { articleId: article3.id, tagId: tags[2].id }, // TypeScript
  })

  console.log('✅ Created article:', article3.title)

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
