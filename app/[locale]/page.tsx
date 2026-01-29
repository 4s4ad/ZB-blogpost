import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArticleCard } from "@/components/article-card"
import { db } from "@/lib/db"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"
import { ArrowRight, Sparkles, BookOpen, Code, Palette, Zap } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const t = await getTranslations("home")

  try {
    const latestArticles = await db.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 4,
    })

    const featuredArticle = latestArticles[0]
    const otherArticles = latestArticles.slice(1)

    return (
      <div className="flex flex-col">
        {/* Hero Section - Bold Asymmetric Design */}
        <section className="relative min-h-[85vh] overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
            <div className="absolute -top-40 -end-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-40 -start-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute top-1/2 start-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary/5 to-transparent blur-3xl" />
          </div>

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-30" />

          <div className="container mx-auto max-w-7xl px-4 py-20 md:py-32">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              {/* Left - Text Content */}
              <div className="flex flex-col gap-8">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    {t("tagline", { fallback: "Welcome to my corner" })}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                    {t("welcome").split(" ").map((word, i) => (
                      <span key={i} className={i === 2 ? "text-primary" : ""}>
                        {word}{" "}
                      </span>
                    ))}
                  </h1>
                  <p className="max-w-lg text-lg leading-relaxed text-muted-foreground md:text-xl">
                    {t("description")}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Button asChild size="lg" className="h-12 gap-2 px-6 text-base">
                    <Link href="/blog">
                      <BookOpen className="h-4 w-4" />
                      {t("readArticles")}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base">
                    <Link href="/about">{t("aboutMe")}</Link>
                  </Button>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-8 pt-4">
                  <div>
                    <p className="text-3xl font-bold text-foreground">{latestArticles.length}+</p>
                    <p className="text-sm text-muted-foreground">Articles</p>
                  </div>
                  <Separator orientation="vertical" className="h-12" />
                  <div>
                    <p className="text-3xl font-bold text-foreground">∞</p>
                    <p className="text-sm text-muted-foreground">Ideas</p>
                  </div>
                  <Separator orientation="vertical" className="h-12" />
                  <div>
                    <p className="text-3xl font-bold text-foreground">24/7</p>
                    <p className="text-sm text-muted-foreground">Learning</p>
                  </div>
                </div>
              </div>

              {/* Right - Featured Article Card */}
              {featuredArticle && (
                <div className="relative">
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-2xl" />
                  <Card className="relative overflow-hidden border-2 border-primary/20 bg-card/80 backdrop-blur-sm">
                    <div className="absolute end-0 top-0 h-20 w-20 bg-gradient-to-bl from-primary/20 to-transparent" />
                    <CardContent className="p-0">
                      {featuredArticle.coverImage && (
                        <div className="relative aspect-[16/10] w-full overflow-hidden">
                          <img
                            src={featuredArticle.coverImage}
                            alt={featuredArticle.title}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                          <Badge className="absolute start-4 top-4">Featured</Badge>
                        </div>
                      )}
                      <div className="space-y-3 p-6">
                        <h3 className="line-clamp-2 text-xl font-bold leading-tight text-foreground">
                          {featuredArticle.title}
                        </h3>
                        <p className="line-clamp-2 text-muted-foreground">
                          {featuredArticle.excerpt}
                        </p>
                        <Button asChild variant="ghost" className="gap-2 px-0 hover:bg-transparent hover:text-primary">
                          <Link href={`/blog/${featuredArticle.slug}`}>
                            Read article
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Topics Section */}
        <section className="border-y border-border/50 bg-muted/30">
          <div className="container mx-auto max-w-7xl px-4 py-16">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Code, label: "Development", desc: "Modern web tech" },
                { icon: Palette, label: "Design", desc: "UI/UX insights" },
                { icon: Zap, label: "Performance", desc: "Speed matters" },
                { icon: BookOpen, label: "Tutorials", desc: "Learn together" },
              ].map((topic) => (
                <div
                  key={topic.label}
                  className="group flex items-center gap-4 rounded-xl border border-border/50 bg-background/50 p-5 transition-all hover:border-primary/50 hover:bg-background"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <topic.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{topic.label}</p>
                    <p className="text-sm text-muted-foreground">{topic.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Articles */}
        <section className="container mx-auto max-w-7xl px-4 py-20">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <Badge variant="outline" className="mb-2">Latest</Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("latestArticles")}
              </h2>
              <p className="max-w-md text-muted-foreground">
                {t("latestArticlesDescription", { fallback: "Fresh perspectives on technology and design" })}
              </p>
            </div>
            <Button asChild variant="outline" className="gap-2 self-start sm:self-auto">
              <Link href="/blog">
                {t("viewAll")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {otherArticles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : latestArticles.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground">No articles yet</h3>
                <p className="mt-2 max-w-sm text-muted-foreground">
                  {t("noArticlesYet", { fallback: "Stay tuned! New content is coming soon." })}
                </p>
                <Button asChild variant="link" className="mt-4">
                  <Link href="/about">{t("learnMore", { fallback: "Learn more about me" })}</Link>
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </section>

        {/* CTA Section */}
        <section className="border-t border-border/50">
          <div className="container mx-auto max-w-7xl px-4 py-20">
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background">
              <div className="absolute -end-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
              <CardContent className="relative flex flex-col items-center gap-6 p-10 text-center md:p-16">
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  Stay Updated
                </Badge>
                <h2 className="max-w-2xl text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
                  Want to explore more insights and tutorials?
                </h2>
                <p className="max-w-lg text-muted-foreground">
                  Dive into the full collection of articles covering development, design, and everything in between.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/blog">
                      Browse All Articles
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="lg">
                    <Link href="/about">About Me</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    )
  } catch (error) {
    console.error("Error loading home page articles:", error)
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{t("welcome")}</h1>
        <p className="mt-4 max-w-md text-muted-foreground">{t("errorLoading")}</p>
        <Button asChild className="mt-8">
          <Link href="/blog">{t("goToBlog")}</Link>
        </Button>
      </div>
    )
  }
}
