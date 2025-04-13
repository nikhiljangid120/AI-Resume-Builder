"use client"

import { useState, useEffect } from "react"
import type { ResumeData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  RefreshCw,
  Zap,
  FileText,
  AlertTriangle,
  CheckCircle,
  Target,
  Lightbulb,
  AlertCircle,
  ExternalLink,
} from "lucide-react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  generateProfessionalSummary,
  enhanceBulletPoints,
  generateTailoringTips,
} from "@/lib/ai-services/gemini-service"
import { useToast } from "@/hooks/use-toast"

interface AIFeaturesProps {
  resumeData: ResumeData
  onDataChange: (data: Partial<ResumeData>) => void
  jobDescription: string
}

export function AIFeatures({ resumeData, onDataChange, jobDescription }: AIFeaturesProps) {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [isEnhancingContent, setIsEnhancingContent] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState("enhance")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [apiKeyStatus, setApiKeyStatus] = useState<"checking" | "available" | "missing">("checking")
  const { toast } = useToast()

  // Check if API key is available
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    setApiKeyStatus(apiKey ? "available" : "missing")
  }, [])

  const handleGenerateSummary = async () => {
    if (apiKeyStatus === "missing") {
      toast({
        title: "API Key Missing",
        description: "Gemini API key is not configured. Please add it to your environment variables.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingSummary(true)
    setError(null)
    setSuccess(null)

    try {
      // Generate a summary based on the resume data
      const summary = await generateProfessionalSummary(resumeData, jobDescription)

      onDataChange({
        personalInfo: {
          ...resumeData.personalInfo,
          summary,
        },
      })

      setSuccess("Professional summary generated successfully!")
      toast({
        title: "Summary Generated",
        description: "Your professional summary has been updated successfully.",
        variant: "success",
      })
    } catch (error) {
      console.error("Error generating summary:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to generate summary. Please try again."

      // Provide a more user-friendly error message
      if (errorMessage.includes("404") || errorMessage.includes("NOT_FOUND")) {
        setError(
          "API error: The Gemini model could not be found. This may be due to API version changes or regional restrictions.",
        )
      } else {
        setError(errorMessage)
      }

      toast({
        title: "Generation Failed",
        description: "There was an error generating your summary. Please check the error message for details.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const handleEnhanceContent = async () => {
    if (apiKeyStatus === "missing") {
      toast({
        title: "API Key Missing",
        description: "Gemini API key is not configured. Please add it to your environment variables.",
        variant: "destructive",
      })
      return
    }

    setIsEnhancingContent(true)
    setError(null)
    setSuccess(null)

    try {
      // Create a deep copy of the resume data
      const enhancedData: Partial<ResumeData> = JSON.parse(JSON.stringify(resumeData))

      // Enhance experience achievements
      if (enhancedData.experience && enhancedData.experience.length > 0) {
        for (let i = 0; i < enhancedData.experience.length; i++) {
          const exp = enhancedData.experience[i]
          if (exp.achievements && exp.achievements.length > 0 && exp.achievements[0]) {
            const context = `${resumeData.personalInfo.title} with experience as ${exp.position} at ${exp.company}`
            try {
              const enhancedAchievements = await enhanceBulletPoints(exp.achievements, context)
              if (enhancedAchievements && enhancedAchievements.length > 0) {
                exp.achievements = enhancedAchievements
              }
            } catch (error) {
              console.error(`Error enhancing achievements for experience ${i}:`, error)
            }
          }
        }
      }

      // Enhance project achievements
      if (enhancedData.projects && enhancedData.projects.length > 0) {
        for (let i = 0; i < enhancedData.projects.length; i++) {
          const project = enhancedData.projects[i]
          if (project.achievements && project.achievements.length > 0 && project.achievements[0]) {
            const context = `${resumeData.personalInfo.title} working on ${project.name} using ${project.technologies}`
            try {
              const enhancedAchievements = await enhanceBulletPoints(project.achievements, context)
              if (enhancedAchievements && enhancedAchievements.length > 0) {
                project.achievements = enhancedAchievements
              }
            } catch (error) {
              console.error(`Error enhancing achievements for project ${i}:`, error)
            }
          }
        }
      }

      onDataChange(enhancedData)
      setSuccess("Resume content enhanced successfully!")
      toast({
        title: "Content Enhanced",
        description: "Your resume content has been enhanced successfully.",
        variant: "success",
      })
    } catch (error) {
      console.error("Error enhancing content:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to enhance content. Please try again."

      // Provide a more user-friendly error message
      if (errorMessage.includes("404") || errorMessage.includes("NOT_FOUND")) {
        setError(
          "API error: The Gemini model could not be found. This may be due to API version changes or regional restrictions.",
        )
      } else {
        setError(errorMessage)
      }

      toast({
        title: "Enhancement Failed",
        description: "There was an error enhancing your content. Please check the error message for details.",
        variant: "destructive",
      })
    } finally {
      setIsEnhancingContent(false)
    }
  }

  const handleAnalyzeResume = async () => {
    if (apiKeyStatus === "missing") {
      toast({
        title: "API Key Missing",
        description: "Gemini API key is not configured. Please add it to your environment variables.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setSuccess(null)

    try {
      const analysis = await generateTailoringTips(resumeData, jobDescription)
      setAnalysisResult(analysis)
      setSuccess("Resume analysis completed!")
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed for ATS compatibility.",
        variant: "success",
      })
    } catch (error) {
      console.error("Error analyzing resume:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze resume. Please try again."

      // Provide a more user-friendly error message
      if (errorMessage.includes("404") || errorMessage.includes("NOT_FOUND")) {
        setError(
          "API error: The Gemini model could not be found. This may be due to API version changes or regional restrictions.",
        )
      } else {
        setError(errorMessage)
      }

      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your resume. Please check the error message for details.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI Resume Assistant
          <Badge
            variant="outline"
            className="ml-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
          >
            Powered by AI
          </Badge>
        </CardTitle>
        <CardDescription>Use AI to improve your resume content and optimize for job matching</CardDescription>
      </CardHeader>

      {apiKeyStatus === "missing" && (
        <Alert variant="destructive" className="mx-4 mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Key Missing</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              Gemini API key is not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.
            </p>
            <a
              href="https://ai.google.dev/tutorials/setup"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm underline"
            >
              Get a Gemini API key <ExternalLink className="h-3 w-3" />
            </a>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="enhance">
            <Zap className="mr-2 h-4 w-4" />
            Enhance Content
          </TabsTrigger>
          <TabsTrigger value="generate">
            <FileText className="mr-2 h-4 w-4" />
            Generate Summary
          </TabsTrigger>
          <TabsTrigger value="analyze">
            <Target className="mr-2 h-4 w-4" />
            Analyze Resume
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enhance" className="space-y-4 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>Enhance your resume content with AI to make it more impactful and ATS-friendly. This will:</p>
            <ul className="ml-5 mt-2 list-disc space-y-1">
              <li>Replace weak verbs with stronger action words</li>
              <li>Add quantifiable metrics to your achievements</li>
              <li>Optimize language for ATS systems</li>
              <li>Improve clarity and impact of your bullet points</li>
            </ul>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert variant="default" className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-700 dark:text-green-200">{success}</AlertDescription>
            </Alert>
          )}

          <Button
            className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
            onClick={handleEnhanceContent}
            disabled={isEnhancingContent || apiKeyStatus === "missing"}
          >
            {isEnhancingContent ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            {isEnhancingContent ? "Enhancing Content..." : "Enhance Resume Content"}
          </Button>
        </TabsContent>

        <TabsContent value="generate" className="space-y-4 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>Generate a professional summary tailored to your experience and skills. This will:</p>
            <ul className="ml-5 mt-2 list-disc space-y-1">
              <li>Create a concise, impactful professional summary</li>
              <li>Highlight your most relevant skills and experience</li>
              <li>Incorporate keywords from the job description (if provided)</li>
              <li>Make your resume more appealing to recruiters and ATS systems</li>
            </ul>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert variant="default" className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-700 dark:text-green-200">{success}</AlertDescription>
            </Alert>
          )}

          <Button
            className="w-full gap-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary || apiKeyStatus === "missing"}
          >
            {isGeneratingSummary ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            {isGeneratingSummary ? "Generating Summary..." : "Generate Professional Summary"}
          </Button>
        </TabsContent>

        <TabsContent value="analyze" className="space-y-4 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>Get a comprehensive analysis of your resume's strengths and weaknesses:</p>
            <ul className="ml-5 mt-2 list-disc space-y-1">
              <li>Identify areas for improvement</li>
              <li>Get personalized recommendations</li>
              <li>Understand how recruiters will view your resume</li>
              <li>Receive tips for better formatting and content</li>
            </ul>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && analysisResult && (
            <div className="space-y-4">
              <Alert variant="default" className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-700 dark:text-green-200">{success}</AlertDescription>
              </Alert>

              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h3 className="mb-2 font-medium">Analysis Results</h3>
                <div className="space-y-2">
                  {analysisResult.map((rec: string, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <Lightbulb className="mt-0.5 h-4 w-4 text-amber-500" />
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Button
            className="w-full gap-2 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300 dark:hover:bg-amber-900"
            onClick={handleAnalyzeResume}
            disabled={isAnalyzing || apiKeyStatus === "missing"}
          >
            {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
            {isAnalyzing ? "Analyzing Resume..." : "Analyze My Resume"}
          </Button>
        </TabsContent>
      </Tabs>

      <CardFooter className="flex justify-between border-t bg-gray-50 px-6 py-3 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
        <p>AI-powered resume optimization</p>
        {jobDescription ? (
          <p className="text-green-600 dark:text-green-400">Using job description for better results</p>
        ) : (
          <p>Add a job description for better results</p>
        )}
      </CardFooter>
    </Card>
  )
}
