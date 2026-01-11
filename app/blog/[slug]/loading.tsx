import { Spinner } from "@/components/ui/spinner"

export default function ArticleLoading() {
  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-muted-foreground">Loading article...</p>
      </div>
    </div>
  )
}
