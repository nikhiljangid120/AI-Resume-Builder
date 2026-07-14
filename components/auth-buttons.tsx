"use client"

import Link from "next/link"
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs"
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
        <SignInButton mode="modal">
          <Button variant="outline" className="border-purple-200 dark:border-purple-800">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
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
      <UserButton />
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
