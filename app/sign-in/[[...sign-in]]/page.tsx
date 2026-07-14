import { SignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function SignInPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    redirect("/resume-builder")
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-violet-50 via-white to-sky-50 px-4 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(147,51,234,0.12),transparent_55%)]" />
      <Link href="/" className="mb-8 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
        <Sparkles className="h-5 w-5 text-purple-600" />
        ResumeRocket AI
      </Link>
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/resume-builder"
        fallbackRedirectUrl="/resume-builder"
      />
    </div>
  )
}
