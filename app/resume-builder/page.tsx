import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ResumeBuilder } from "@/components/resume-builder"

export default async function ResumeBuilderPage() {
  if (process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    const { userId } = await auth()
    if (!userId) {
      redirect("/sign-in")
    }
  }

  return <ResumeBuilder />
}
