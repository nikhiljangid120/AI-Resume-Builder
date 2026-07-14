"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

function ClerkAuthButtons({ className = "" }: { className?: string }) {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button variant="outline" disabled>
          Loading…
        </Button>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <SignInButton mode="modal" forceRedirectUrl="/resume-builder">
          <Button variant="outline" className="border-purple-200 dark:border-purple-800">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton mode="modal" forceRedirectUrl="/resume-builder">
          <Button className="bg-purple-600 hover:bg-purple-700 futuristic-button">Get Started</Button>
        </SignUpButton>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Link href="/resume-builder">
        <Button className="bg-purple-600 hover:bg-purple-700 futuristic-button">Launch App</Button>
      </Link>
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}

export function AuthButtons({ className = "" }: { className?: string }) {
  if (!hasClerk) {
    return (
      <Link href="/resume-builder" className={className}>
        <Button className="bg-purple-600 hover:bg-purple-700 futuristic-button">Launch App</Button>
      </Link>
    )
  }

  return <ClerkAuthButtons className={className} />
}

function ClerkLaunchCta({
  label,
  className,
  size = "lg",
}: {
  label: string
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
}) {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()

  const handleClick = () => {
    if (!isLoaded) return
    if (isSignedIn) {
      router.push("/resume-builder")
      return
    }
    router.push("/sign-up")
  }

  return (
    <Button size={size} className={className} onClick={handleClick} disabled={!isLoaded}>
      {label} <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  )
}

export function LaunchAppCta({
  label = "Build Your Resume",
  className = "bg-purple-600 hover:bg-purple-700 futuristic-button",
  size = "lg",
}: {
  label?: string
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
}) {
  const router = useRouter()

  if (!hasClerk) {
    return (
      <Button size={size} className={className} onClick={() => router.push("/resume-builder")}>
        {label} <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    )
  }

  return <ClerkLaunchCta label={label} className={className} size={size} />
}
