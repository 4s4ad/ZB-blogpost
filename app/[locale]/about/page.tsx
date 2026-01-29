import { getTranslations } from "next-intl/server"

export default async function AboutPage() {
  const t = await getTranslations("about")

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-foreground">{t("title")}</h1>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t("intro")}
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t("description")}
          </p>
          <h2 className="text-2xl font-semibold text-foreground">{t("whatIWrite")}</h2>
          <ul className="list-disc ps-6 text-muted-foreground">
            <li>{t("topics.nextjs")}</li>
            <li>{t("topics.uiux")}</li>
            <li>{t("topics.typescript")}</li>
            <li>{t("topics.scalable")}</li>
          </ul>
          <h2 className="text-2xl font-semibold text-foreground">{t("getInTouch")}</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t("getInTouchText")}
          </p>
        </div>
      </div>
    </div>
  )
}
