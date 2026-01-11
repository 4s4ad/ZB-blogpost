import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle, Clock, Plus, ArrowUpRight, MessageSquare, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Dashboard",
  description: "Admin dashboard overview",
}

export default async function AdminDashboardPage() {
  const [totalArticles, publishedArticles, draftArticles, recentArticles] = await Promise.all([
    db.article.count(),
    db.article.count({ where: { published: true } }),
    db.article.count({ where: { published: false } }),
    db.article.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ])

  const stats = [
    {
      title: "Total Articles",
      value: totalArticles,
      icon: FileText,
      description: "All time blog posts",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Published",
      value: publishedArticles,
      icon: CheckCircle,
      description: "Live on the website",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Drafts",
      value: draftArticles,
      icon: Clock,
      description: "In progress work",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Manage your blog content and view performance analytics.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/blog" target="_blank">View Site</Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/admin/articles/new">
              <Plus className="h-4 w-4" />
              New Article
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="relative overflow-hidden border-none bg-muted/50 transition-all hover:bg-muted/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</CardTitle>
                <div className={`rounded-full p-2 ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Articles */}
        <Card className="border-none bg-muted/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Articles</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/articles" className="gap-1">
                View All <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentArticles.length > 0 ? (
                recentArticles.map((article) => (
                  <div key={article.id} className="group flex items-center justify-between rounded-xl border border-border/50 bg-background/50 p-4 transition-all hover:border-primary/50 hover:bg-background">
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="font-semibold text-foreground decoration-primary underline-offset-4 hover:underline"
                      >
                        {article.title}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium ${article.published ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                          {article.published ? "Live" : "Draft"}
                        </span>
                        <span>•</span>
                        <span>{new Date(article.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <Button asChild variant="secondary" size="sm" className="opacity-0 transition-opacity group-hover:opacity-100">
                      <Link href={`/admin/articles/${article.id}/edit`}>Edit</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No articles yet. Start by creating one!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Placeholder for other features */}
        <Card className="border-none bg-muted/30">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Settings", icon: Users, href: "#" },
                { label: "Appearance", icon: MessageSquare, href: "#" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border/50 bg-background/50 p-6 transition-all hover:border-primary/50 hover:bg-background"
                >
                  <item.icon className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
