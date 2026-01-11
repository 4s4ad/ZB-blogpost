import { getSession } from "@/lib/session"

export async function AdminTopBar() {
  const session = await getSession()

  return (
    <div className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <h1 className="text-lg font-semibold text-foreground">Admin Dashboard</h1>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Welcome, {session?.name}</span>
      </div>
    </div>
  )
}
