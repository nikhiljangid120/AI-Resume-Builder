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
  ArrowRight,
  BarChart2,
  CheckSquare,
  Copy,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  generateProfessionalSummary,
  analyzeResumeStrengthsWeaknesses,
  generateTailoringTips,
  enhanceBulletPoints,
  analyzeTextSimilarity,
} from "@/lib/ai-services/groq-service"
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
  const [originalSummary, setOriginalSummary] = useState<string>("")
  const [newSummary, setNewSummary] = useState<string>("")
  const [enhancementResults, setEnhancementResults] = useState<
    { original: string[]; enhanced: string[]; context: string }[]
  >([])
  const [detailedAnalysis, setDetailedAnalysis] = useState<{
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    score: number
    keywordMatch: number
    readability: number
    impact: number
  } | null>(null)
  const { toast } = useToast()

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
    setOriginalSummary(resumeData.personalInfo.summary || "")

    try {
      const summary = await generateProfessionalSummary(resumeData, jobDescription)
      setNewSummary(summary)
      onDataChange({
        personalInfo: { ...resumeData.personalInfo, summary },
      })
      setSuccess("Professional summary generated successfully!")
      toast({
        title: "Summary Generated",
        description: "Your professional summary has been updated successfully.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error generating summary:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to generate summary. Please try again."
      if (errorMessage.includes("404") || errorMessage.includes("NOT_FOUND")) {
        setError("API error: The Gemini model could not be found. This may be due to API version changes or regional restrictions.")
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
    setEnhancementResults([])

    try {
      const enhancedData: Partial<ResumeData> = JSON.parse(JSON.stringify(resumeData))
      const enhancementResultsTemp: { original: string[]; enhanced: string[]; context: string }[] = []

      if (enhancedData.experience && enhancedData.experience.length > 0) {
        for (let i = 0; i < enhancedData.experience.length; i++) {
          const exp = enhancedData.experience[i]
          if (exp.achievements && exp.achievements.length > 0 && exp.achievements[0]) {
            const context = `${resumeData.personalInfo.title} with experience as ${exp.position} at ${exp.company}`
            try {
              const originalAchievements = [...exp.achievements]
              const enhancedAchievements = await enhanceBulletPoints(exp.achievements, context)
              if (enhancedAchievements && enhancedAchievements.length > 0) {
                exp.achievements = enhancedAchievements
                enhancementResultsTemp.push({
                  original: originalAchievements,
                  enhanced: enhancedAchievements,
                  context: `Experience: ${exp.position} at ${exp.company}`,
                })
              }
            } catch (error) {
              console.error(`Error enhancing achievements for experience ${i}:`, error)
            }
          }
        }
      }

      if (enhancedData.projects && enhancedData.projects.length > 0) {
        for (let i = 0; i < enhancedData.projects.length; i++) {
          const project = enhancedData.projects[i]
          if (project.achievements && project.achievements.length > 0 && project.achievements[0]) {
            const context = `${resumeData.personalInfo.title} working on ${project.name} using ${project.technologies}`
            try {
              const originalAchievements = [...project.achievements]
              const enhancedAchievements = await enhanceBulletPoints(project.achievements, context)
              if (enhancedAchievements && enhancedAchievements.length > 0) {
                project.achievements = enhancedAchievements
                enhancementResultsTemp.push({
                  original: originalAchievements,
                  enhanced: enhancedAchievements,
                  context: `Project: ${project.name}`,
                })
              }
            } catch (error) {
              console.error(`Error enhancing achievements for project ${i}:`, error)
            }
          }
        }
      }

      setEnhancementResults(enhancementResultsTemp)
      onDataChange(enhancedData)
      setSuccess("Resume content enhanced successfully!")
      toast({
        title: "Content Enhanced",
        description: `Successfully enhanced ${enhancementResultsTemp.length} sections of your resume.`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error enhancing content:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to enhance content. Please try again."
      if (errorMessage.includes("404") || errorMessage.includes("NOT_FOUND")) {
        setError("API error: The Gemini model could not be found. This may be due to API version changes or regional restrictions.")
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
    setDetailedAnalysis(null)

    try {
      const tailoringTips = await generateTailoringTips(resumeData, jobDescription)
      const analysis = await analyzeResumeStrengthsWeaknesses(resumeData, jobDescription)
      setAnalysisResult(tailoringTips)
      setDetailedAnalysis(analysis)
      setSuccess("Resume analysis completed!")
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed in detail.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error analyzing resume:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze resume. Please try again."
      if (errorMessage.includes("404") || errorMessage.includes("NOT_FOUND")) {
        setError("API error: The Gemini model could not be found. This may be due to API version changes or regional restrictions.")
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: "Text has been copied to your clipboard.",
      variant: "default",
    })
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader className="px-3 sm:px-6">
        <CardTitle className="flex flex-wrap items-center gap-2 text-lg md:text-xl">
          <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />
          AI Resume Assistant
          <Badge
            variant="outline"
            className="ml-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs"
          >
            Powered by AI
          </Badge>
        </CardTitle>
        <CardDescription className="text-sm">
          Use AI to improve your resume content and optimize for job matching
        </CardDescription>
      </CardHeader>

      {apiKeyStatus === "missing" && (
        <Alert variant="destructive" className="mx-3 sm:mx-6 mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-sm">API Key Missing</AlertTitle>
          <AlertDescription>
            <p className="mb-2 text-sm">
              Gemini API key is not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.
            </p>
            <a
              href="https://ai.google.dev/tutorials/setup"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs underline"
            >
              Get a Gemini API key <ExternalLink className="h-3 w-3" />
            </a>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full px-3 sm:px-6">
        <TabsList className="grid w-full grid-cols-3 mb-4 h-auto">
          <TabsTrigger value="enhance" className="text-xs sm:text-sm py-2 sm:py-3 px-1 sm:px-3 h-auto">
            <Zap className="mr-1 h-3 w-3 md:mr-2 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Enhance </span>Content
          </TabsTrigger>
          <TabsTrigger value="generate" className="text-xs sm:text-sm py-2 sm:py-3 px-1 sm:px-3 h-auto">
            <FileText className="mr-1 h-3 w-3 md:mr-2 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Generate </span>Summary
          </TabsTrigger>
          <TabsTrigger value="analyze" className="text-xs sm:text-sm py-2 sm:py-3 px-1 sm:px-3 h-auto">
            <Target className="mr-1 h-3 w-3 md:mr-2 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Analyze </span>Resume
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enhance" className="space-y-4">
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
              <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {success && enhancementResults.length > 0 && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <Alert variant="default" className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-700 dark:text-green-200 text-xs sm:text-sm">
                  {success} Enhanced {enhancementResults.length} sections with{" "}
                  {enhancementResults.reduce((acc, curr) => acc + curr.enhanced.length, 0)} achievements.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {enhancementResults.map((result, idx) => (
                  <Card key={idx} className="overflow-hidden">
                    <CardHeader className="bg-purple-50 dark:bg-purple-900/20 py-2">
                      <CardTitle className="text-xs sm:text-sm font-medium">{result.context}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {result.original.map((orig, i) => (
                          <div key={i} className="flex flex-col sm:flex-row p-2 sm:p-4 gap-3">
                            <div className="flex-1 p-2 rounded-md bg-gray-50 dark:bg-gray-800/50 relative">
                              <div className="absolute top-0 right-0 p-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => copyToClipboard(orig)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <Badge variant="outline" className="mb-2 bg-gray-100 text-gray-800 text-xs">
                                Original
                              </Badge>
                              <p className="text-xs sm:text-sm">{orig}</p>
                            </div>
                            <div className="flex items-center justify-center sm:hidden">
                              <ArrowRight className="h-4 w-4 text-purple-500 -rotate-90 sm:rotate-0" />
                            </div>
                            <div className="hidden sm:flex items-center justify-center">
                              <ArrowRight className="h-4 w-4 text-purple-500" />
                            </div>
                            <div className="flex-1 p-2 rounded-md bg-purple-50 dark:bg-purple-900/20 relative">
                              <div className="absolute top-0 right-0 p-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => copyToClipboard(result.enhanced[i] || "")}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <Badge variant="outline" className="mb-2 bg-purple-100 text-purple-800 text-xs">
                                Enhanced
                              </Badge>
                              <p className="text-xs sm:text-sm">{result.enhanced[i] || ""}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Button
            className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm py-3 min-h-[44px]"
            onClick={handleEnhanceContent}
            disabled={isEnhancingContent || apiKeyStatus === "missing"}
          >
            {isEnhancingContent ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            {isEnhancingContent ? "Enhancing Content..." : "Enhance Resume Content"}
          </Button>
        </TabsContent>

        <TabsContent value="generate" className="space-y-4">
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
              <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {success && newSummary && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <Alert variant="default" className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-700 dark:text-green-200 text-xs sm:text-sm">{success}</AlertDescription>
              </Alert>

              <Card className="overflow-hidden">
                <CardHeader className="bg-blue-50 dark:bg-blue-900/20 py-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Professional Summary Comparison</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    <div className="p-2 sm:p-4">
                      <div className="p-2 rounded-md bg-gray-50 dark:bg-gray-800/50 mb-4 relative">
                        <div className="absolute top-0 right-0 p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(originalSummary)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <Badge variant="outline" className="mb-2 bg-gray-100 text-gray-800 text-xs">
                          Original Summary
                        </Badge>
                        <p className="text-xs sm:text-sm">{originalSummary || "No previous summary"}</p>
                      </div>

                      <div className="flex justify-center my-2">
                        <ArrowRight className="h-4 w-4 text-blue-500 rotate-90 sm:rotate-0" />
                      </div>

                      <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-900/20 relative">
                        <div className="absolute top-0 right-0 p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(newSummary)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <Badge variant="outline" className="mb-2 bg-blue-100 text-blue-800 text-xs">
                          New AI-Generated Summary
                        </Badge>
                        <p className="text-xs sm:text-sm">{newSummary}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Summary Improvements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">Added relevant keywords for better ATS matching</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">Improved clarity and conciseness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">Highlighted your most relevant skills and experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">Tailored to match job description requirements</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          <Button
            className="w-full gap-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900 text-xs sm:text-sm py-3 min-h-[44px]"
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary || apiKeyStatus === "missing"}
          >
            {isGeneratingSummary ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            {isGeneratingSummary ? "Generating Summary..." : "Generate Professional Summary"}
          </Button>
        </TabsContent>

        <TabsContent value="analyze" className="space-y-4">
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
              <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {success && analysisResult && detailedAnalysis && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <Alert variant="default" className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-700 dark:text-green-200 text-xs sm:text-sm">{success}</AlertDescription>
              </Alert>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <BarChart2 className="h-4 w-4 text-amber-500" />
                    Resume Performance Analysis
                  </CardTitle>
                  <CardDescription className="text-xs">Overall score and key metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-medium">Overall Score</span>
                      <span className="text-xs sm:text-sm font-bold">{detailedAnalysis.score}%</span>
                    </div>
                    <Progress value={detailedAnalysis.score} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="space-y-2 rounded-lg border p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Keyword Match</span>
                        <span
                          className={`text-xs font-bold ${detailedAnalysis.keywordMatch >= 70 ? "text-green-600" : "text-amber-600"}`}
                        >
                          {detailedAnalysis.keywordMatch}%
                        </span>
                      </div>
                      <Progress
                        value={detailedAnalysis.keywordMatch}
                        className="h-1.5"
                        indicatorClassName={detailedAnalysis.keywordMatch >= 70 ? "bg-green-600" : "bg-amber-600"}
                      />
                    </div>
                    <div className="space-y-2 rounded-lg border p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Readability</span>
                        <span
                          className={`text-xs font-bold ${detailedAnalysis.readability >= 70 ? "text-green-600" : "text-amber-600"}`}
                        >
                          {detailedAnalysis.readability}%
                        </span>
                      </div>
                      <Progress
                        value={detailedAnalysis.readability}
                        className="h-1.5"
                        indicatorClassName={detailedAnalysis.readability >= 70 ? "bg-green-600" : "bg-amber-600"}
                      />
                    </div>
                    <div className="space-y-2 rounded-lg border p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Impact Score</span>
                        <span
                          className={`text-xs font-bold ${detailedAnalysis.impact >= 70 ? "text-green-600" : "text-amber-600"}`}
                        >
                          {detailedAnalysis.impact}%
                        </span>
                      </div>
                      <Progress
                        value={detailedAnalysis.impact}
                        className="h-1.5"
                        indicatorClassName={detailedAnalysis.impact >= 70 ? "bg-green-600" : "bg-amber-600"}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Card>
                  <CardHeader className="pb-2 bg-green-50 dark:bg-green-900/20">
                    <CardTitle className="text-xs sm:text-sm font-medium text-green-800 dark:text-green-300">Strengths</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <ul className="space-y-2">
                      {detailedAnalysis.strengths.map((strength, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 bg-amber-50 dark:bg-amber-900/20">
                    <CardTitle className="text-xs sm:text-sm font-medium text-amber-800 dark:text-amber-300">Weaknesses</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <ul className="space-y-2">
                      {detailedAnalysis.weaknesses.map((weakness, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-900/20">
                  <CardTitle className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-300">
                    <Lightbulb className="h-4 w-4 inline mr-1" />
                    Improvement Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3">
                  <ul className="space-y-2">
                    {detailedAnalysis.opportunities.map((opportunity, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {analysisResult.tailoringTips && (
                <Card>
                  <CardHeader className="pb-2 bg-purple-50 dark:bg-purple-900/20">
                    <CardTitle className="text-xs sm:text-sm font-medium text-purple-800 dark:text-purple-300">
                      <Target className="h-4 w-4 inline mr-1" />
                      Job-Specific Tailoring Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <ul className="space-y-2">
                      {analysisResult.tailoringTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <Button
            className="w-full gap-2 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300 dark:hover:bg-amber-900 text-xs sm:text-sm py-3 min-h-[44px]"
            onClick={handleAnalyzeResume}
            disabled={isAnalyzing || apiKeyStatus === "missing"}
          >
            {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
            {isAnalyzing ? "Analyzing Resume..." : "Analyze Resume"}
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  )
}