import { getTranslations } from "next-intl/server"
import { Code2, Palette, FileCode, Layers } from "lucide-react"

export default async function AboutPage() {
  const t = await getTranslations("about")

  const topics = [
    { icon: Code2, key: "nextjs" },
    { icon: Palette, key: "uiux" },
    { icon: FileCode, key: "typescript" },
    { icon: Layers, key: "scalable" },
  ]

  return (
    <div className="flex flex-col">
      {/* Header Section */}
      <section className="border-b border-border/40 bg-muted/30">
        <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto max-w-4xl px-4 py-10 md:py-14">
        <div className="grid gap-12">
          {/* Intro */}
          <div className="space-y-4">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t("intro")}
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t("description")}
            </p>
          </div>

          {/* What I Write About */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              {t("whatIWrite")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {topics.map((topic) => {
                const Icon = topic.icon
                return (
                  <div
                    key={topic.key}
                    className="flex items-start gap-4 rounded-lg border border-border/60 bg-card p-4 transition-colors hover:border-border hover:bg-muted/50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {t(`topics.${topic.key}`)}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Get in Touch */}
          <div className="space-y-4 rounded-lg border border-border/60 bg-muted/30 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              {t("getInTouch")}
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t("getInTouchText")}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
