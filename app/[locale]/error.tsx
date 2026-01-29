"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("errors.generic")
  const tCommon = useTranslations("common")

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-4xl font-bold text-foreground">{t("title")}</h1>
      <p className="text-center text-muted-foreground">{error.message || t("description")}</p>
      {error.digest && <p className="text-xs text-muted-foreground/50">Digest: {error.digest}</p>}
      <Button onClick={() => reset()}>{tCommon("tryAgain")}</Button>
    </div>
  )
}
