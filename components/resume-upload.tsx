"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { FileText } from "lucide-react"
import type { ResumeData } from "@/lib/types"
import { AIResumeGenerator } from "@/components/ai-resume-generator"

interface ResumeUploadProps {
  resumeData: ResumeData
  onResumeDataExtracted: (data: Partial<ResumeData>) => void
  onResumeTextExtracted: (text: string) => void
  onDataChange: (data: Partial<ResumeData>) => void
}

export function ResumeUpload({
  resumeData,
  onResumeDataExtracted,
  onResumeTextExtracted,
  onDataChange,
}: ResumeUploadProps) {
  const [jobDescription, setJobDescription] = useState("")

  const handleJobDescriptionChange = (value: string) => {
    setJobDescription(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-500" />
          AI Resume Builder
        </CardTitle>
        <CardDescription>Generate a complete resume with our advanced AI technology</CardDescription>
      </CardHeader>
      <CardContent>
        <AIResumeGenerator
          resumeData={resumeData}
          onResumeDataGenerated={onDataChange}
          jobDescription={jobDescription}
          onJobDescriptionChange={handleJobDescriptionChange}
        />
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-3 text-xs text-gray-500 dark:bg-gray-900 dark:text-gray-400">
        <p>Our AI uses open-source models to generate high-quality resume content tailored to your needs.</p>
      </CardFooter>
    </Card>
  )
}
