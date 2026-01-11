import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { LoginForm } from "@/components/admin/login-form"

export const metadata = {
  title: "Admin Login",
  description: "Login to access the admin dashboard",
}

export default async function LoginPage() {
  const session = await getSession()

  if (session) {
    redirect("/admin")
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Admin Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to access the dashboard</p>
        </div>
        <LoginForm />
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Demo credentials: admin@blog.com / password123</p>
        </div>
      </div>
    </div>
  )
}
