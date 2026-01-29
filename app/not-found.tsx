import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
          <h1 className="text-6xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-center text-gray-600">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/en">Go Home</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
