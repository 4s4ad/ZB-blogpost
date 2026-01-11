# MyBlog - Personal Blog Website

A modern, full-featured personal blog built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Public Website
- Clean, modern blog interface
- Article list with filtering and search
- Individual article pages with markdown rendering
- Syntax highlighting for code blocks
- Responsive design
- Dark mode support
- SEO optimized

### Admin Dashboard
- Secure authentication
- Dashboard overview with statistics
- Full article management (CRUD)
- Markdown editor with live preview
- Publish/draft functionality
- Protected routes with middleware

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Markdown**: react-markdown with syntax highlighting
- **Authentication**: Custom session-based auth
- **Database**: Mock data layer (ready for Prisma migration)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Admin Access

- **Login URL**: `/admin/login`
- **Demo Credentials**:
  - Email: `admin@blog.com`
  - Password: `password123`

## Project Structure

```
├── app/
│   ├── (public)/          # Public-facing pages
│   │   ├── page.tsx       # Homepage
│   │   ├── blog/          # Blog pages
│   │   └── about/         # About page
│   └── admin/             # Admin dashboard
│       ├── login/         # Login page
│       ├── articles/      # Article management
│       └── page.tsx       # Dashboard
├── components/
│   ├── admin/             # Admin components
│   └── ui/                # UI components
├── lib/
│   ├── db.ts              # Mock database
│   ├── auth.ts            # Authentication
│   └── session.ts         # Session management
└── prisma/
    └── schema.prisma      # Database schema
```

## Database Migration

The project currently uses a mock database for development. To migrate to a real database:

1. Set up your database and add `DATABASE_URL` to your environment variables
2. Run Prisma migrations:
```bash
npx prisma migrate dev
```
3. Replace mock DB imports with Prisma Client in `lib/db.ts`

## Deployment

Deploy to Vercel with one click or use the Vercel CLI:

```bash
vercel
```

## Future Enhancements

- Comments system
- Analytics integration
- Newsletter subscription
- Tag and category management
- Image upload functionality
- Social sharing buttons

## License

MIT
