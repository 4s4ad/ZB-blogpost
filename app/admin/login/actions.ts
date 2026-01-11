"use server"

import { redirect } from "next/navigation"
import { verifyCredentials } from "@/lib/auth"
import { createSession } from "@/lib/session"

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Please provide both email and password" }
  }

  const user = await verifyCredentials(email, password)

  if (!user || user.role !== "ADMIN") {
    return { error: "Invalid credentials" }
  }

  await createSession(user.id)
  redirect("/admin")
}

export async function logoutAction() {
  const { deleteSession } = await import("@/lib/session")
  await deleteSession()
  redirect("/")
}
