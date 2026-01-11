import "server-only"
import { cookies } from "next/headers"
import { db } from "./db"

const SESSION_COOKIE_NAME = "admin_session"

export async function createSession(userId: string) {
  const cookieStore = await cookies()

  // In a production app, you'd create a session token and store it in a database
  // For simplicity, we're storing the userId directly (NOT recommended for production)
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })
}

export async function getSession() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionId) {
    return null
  }

  const user = await db.user.findUnique({
    where: { id: sessionId },
  })

  if (!user || user.role !== "ADMIN") {
    return null
  }

  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
