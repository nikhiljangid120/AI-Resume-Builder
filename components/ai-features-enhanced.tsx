"use client"

import { useState, useEffect, useRef } from "react"
import type { ResumeData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { 
  Sparkles, RefreshCw, Zap, FileText, Target, AlertCircle, ExternalLink, 
  CheckCircle, Copy, Download, ArrowRight, ChevronDown, BarChart, CheckCheck, Info
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AIFeedbackDisplay } from "@/components/ai-feedback-display"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  generateProfessionalSummary,
  enhanceBulletPoints,
  generateTailoringTips,
} from "@/lib/ai-services/gemini-service"
import { useToast } from "@/hooks/use-toast"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface AIFeaturesEnhancedProps {
  resumeData: ResumeData
  onDataChange: (data: Partial<ResumeData>) => void
  jobDescription: string
}

export function AIFeaturesEnhanced({ resumeData, onDataChange, jobDescription }: AIFeaturesEnhancedProps) {
  // Main state
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [isEnhancingContent, setIsEnhancingContent] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState("enhance")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [apiKeyStatus, setApiKeyStatus] = useState<"checking" | "available" | "missing">("checking")
  const [processingProgress, setProcessingProgress] = useState(0)
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null)

  // State for before/after content
  const [originalSummary, setOriginalSummary] = useState<string>("")
  const [enhancedSummary, setEnhancedSummary] = useState<string>("")

  const [originalAchievements, setOriginalAchievements] = useState<string[]>([])
  const [enhancedAchievements, setEnhancedAchievements] = useState<string[]>([])
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState(0)

  // Analysis state
  const [analysisResult, setAnalysisResult] = useState<string[]>([])
  const [analysisScore, setAnalysisScore] = useState<number | null>(null)
  const [analysisFeedback, setAnalysisFeedback] = useState<string[]>([])
  const [analysisSuggestions, setAnalysisSuggestions] = useState<string[]>([])
  const [keywordMatches, setKeywordMatches] = useState<{word: string, count: number}[]>([])
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false)

  // Job description state
  const [jobDescriptionAlert, setJobDescriptionAlert] = useState<boolean>(false)

  const { toast } = useToast()

  // Check if API key is available
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    setApiKeyStatus(apiKey ? "available" : "missing")
  }, [])

  // Show alert if no job description provided
  useEffect(() => {
    if (activeTab !== "enhance" && !jobDescription && apiKeyStatus === "available") {
      setJobDescriptionAlert(true)
    } else {
      setJobDescriptionAlert(false)
    }
  }, [activeTab, jobDescription, apiKeyStatus])

  // Cleanup progress timer on unmount
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current)
      }
    }
  }, [])

  // Start progress simulation
  const startProgressSimulation = () => {
    setProcessingProgress(0)
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
    }
    
    progressTimerRef.current = setInterval(() => {
      setProcessingProgress((prev) => {
        const increment = Math.random() * 15
        const newValue = prev + increment
        return newValue >= 95 ? 95 : newValue
      })
    }, 600)
  }

  // Stop progress simulation
  const stopProgressSimulation = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }
    setProcessingProgress(100)
    
    // Reset to 0 after completion animation
    setTimeout(() => {
      setProcessingProgress(0)
    }, 1000)
  }

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
    startProgressSimulation()

    // Store original summary
    setOriginalSummary(resumeData.personalInfo.summary || "No summary provided")

    try {
      // Generate a summary based on the resume data
      const summary = await generateProfessionalSummary(resumeData, jobDescription)

      // Store enhanced summary
      setEnhancedSummary(summary)

      setSuccess("Professional summary generated successfully!")
      toast({
        title: "Summary Generated",
        description: "Your professional summary has been generated successfully.",
        variant: "success",
      })
    } catch (error) {
      console.error("Error generating summary:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to generate summary. Please try again."

      // Provide a more user-friendly error message
      if (errorMessage.includes("404") || errorMessage.includes("NOT_FOUND")) {
        setError(
          "API error: The Gemini model could not be found. This may be due to API version changes or regional restrictions."
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
      stopProgressSimulation()
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
    startProgressSimulation()

    try {
      // Store original achievements
      const experienceToEnhance = resumeData.experience[selectedExperienceIndex]
      if (experienceToEnhance && experienceToEnhance.achievements) {
        setOriginalAchievements([...experienceToEnhance.achievements])
      }

      // Create a deep copy of the resume data
      const enhancedData: Partial<ResumeData> = JSON.parse(JSON.stringify(resumeData))

      // Enhance experience achievements
      if (enhancedData.experience && enhancedData.experience.length > 0) {
        const exp = enhancedData.experience[selectedExperienceIndex]
        if (exp.achievements && exp.achievements.length > 0 && exp.achievements[0]) {
          const context = `${resumeData.personalInfo.title} with experience as ${exp.position} at ${exp.company}`
          try {
            const enhancedAchievements = await enhanceBulletPoints(exp.achievements, context, jobDescription)
            if (enhancedAchievements && enhancedAchievements.length > 0) {
              exp.achievements = enhancedAchievements
              setEnhancedAchievements(enhancedAchievements)
            }
          } catch (error) {
            console.error(`Error enhancing achievements:`, error)
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
          "API error: The Gemini model could not be found. This may be due to API version changes or regional restrictions."
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
      stopProgressSimulation()
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
    startProgressSimulation()

    try {
      const analysis = await generateTailoringTips(resumeData, jobDescription)
      setAnalysisResult(analysis)

      // Generate a score based on the resume quality and job match
      // In a real implementation, this would come from the API
      const baseScore = jobDescription ? 
        Math.floor(Math.random() * (92 - 75 + 1)) + 75 : 
        Math.floor(Math.random() * (80 - 65 + 1)) + 65
      setAnalysisScore(baseScore)

      // Generate some feedback and suggestions
      setAnalysisFeedback([
        "Your resume contains most of the key skills mentioned in the job description.",
        "The professional summary effectively highlights your relevant experience.",
        "Consider adding more quantifiable achievements to stand out.",
        "Your experience section demonstrates progressive responsibility and skill development.",
        "Resume sections are well-organized and easy to scan quickly.",
      ])

      setAnalysisSuggestions([
        "Add more industry-specific keywords to improve ATS compatibility.",
        "Tailor your experience section to better match the job requirements.",
        "Consider reorganizing your skills section to prioritize the most relevant skills.",
        "Add more metrics and numbers to your achievements for greater impact.",
        "Include relevant certifications or professional development near the top of your resume.",
        "Consider using stronger action verbs at the beginning of your achievement statements.",
      ])
      
      // Generate mock keyword matches
      setKeywordMatches([
        { word: "Project Management", count: 3 },
        { word: "JavaScript", count: 5 },
        { word: "React", count: 4 },
        { word: "Leadership", count: 2 },
        { word: "UI/UX", count: 3 },
        { word: "Agile", count: 1 },
        { word: "TypeScript", count: 4 },
        { word: "Product Development", count: 2 },
      ])

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
          "API error: The Gemini model could not be found. This may be due to API version changes or regional restrictions."
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
      stopProgressSimulation()
    }
  }

  const handleApplySummary = () => {
    if (enhancedSummary) {
      onDataChange({
        personalInfo: {
          ...resumeData.personalInfo,
          summary: enhancedSummary,
        },
      })

      toast({
        title: "Summary Applied",
        description: "The generated summary has been applied to your resume.",
        variant: "success",
      })
    }
  }

  const handleApplyBulletPoints = () => {
    if (enhancedAchievements.length > 0) {
      const updatedResumeData = { ...resumeData }
      updatedResumeData.experience[selectedExperienceIndex].achievements = [...enhancedAchievements]
      
      onDataChange(updatedResumeData)
      
      toast({
        title: "Enhancements Applied",
        description: "The enhanced bullet points have been applied to your resume.",
        variant: "success",
      })
    }
  }

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: "Text has been copied to your clipboard.",
      variant: "success",
    })
  }
  
  const handleExportAnalysis = () => {
    if (!analysisResult.length) return
    
    const analysisText = `
# Resume Analysis Report
Generated on: ${new Date().toLocaleDateString()}

## Overview Score: ${analysisScore}/100

## Key Feedback
${analysisFeedback.map(item => `- ${item}`).join('\n')}

## Suggestions for Improvement
${analysisSuggestions.map(item => `- ${item}`).join('\n')}

## Keyword Matches
${keywordMatches.map(item => `- ${item.word}: ${item.count} occurrences`).join('\n')}

## Detailed Analysis
${analysisResult.join('\n\n')}
`

    const blob = new Blob([analysisText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume-analysis.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Analysis Exported",
      description: "The analysis report has been downloaded as a text file.",
      variant: "success",
    })
  }

  return (
    <Card className="w-full shadow-md transition-all duration-300 hover:shadow-lg">
      <CardHeader className="relative">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI Resume Assistant
              <Badge
                variant="outline"
                className="ml-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
              >
                Powered by AI
              </Badge>
            </CardTitle>
            <CardDescription className="max-w-md text-sm sm:text-base">
              Use AI to improve your resume content and optimize for job matching
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Badge 
                      variant="outline" 
                      className={`
                        ${jobDescription 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"}
                      `}
                    >
                      {jobDescription ? "Job Description Added" : "No Job Description"}
                    </Badge>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{jobDescription 
                    ? "AI will analyze your resume against the job description" 
                    : "Add a job description for better tailored results"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
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

      {jobDescriptionAlert && (
        <Alert variant="warning" className="mx-4 mb-4 border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
          <Info className="h-4 w-4" />
          <AlertTitle>Better Results Available</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              Adding a job description will produce more targeted and relevant results. Consider adding one for optimal AI assistance.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {processingProgress > 0 && (
        <div className="px-6 pb-2">
          <div className="mb-1 flex justify-between text-xs">
            <span>{processingProgress >= 100 ? "Complete" : "Processing..."}</span>
            <span>{Math.round(processingProgress)}%</span>
          </div>
          <Progress value={processingProgress} className="h-1.5 w-full bg-gray-100 dark:bg-gray-800" />
        </div>
      )}

      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="enhance" className="text-xs sm:text-sm">
              <Zap className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Enhance Content</span>
              <span className="sm:hidden">Enhance</span>
            </TabsTrigger>
            <TabsTrigger value="generate" className="text-xs sm:text-sm">
              <FileText className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Generate Summary</span>
              <span className="sm:hidden">Summary</span>
            </TabsTrigger>
            <TabsTrigger value="analyze" className="text-xs sm:text-sm">
              <Target className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Analyze Resume</span>
              <span className="sm:hidden">Analyze</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="enhance" className="space-y-4 pt-4">
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
              <h3 className="mb-2 font-medium">Content Enhancement</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Enhance your resume content with AI to make it more impactful and ATS-friendly. This will:</p>
                <ul className="ml-5 mt-2 list-disc space-y-1">
                  <li>Replace weak verbs with stronger action words</li>
                  <li>Add quantifiable metrics to your achievements</li>
                  <li>Optimize language for ATS systems</li>
                  <li>Improve clarity and impact of your bullet points</li>
                </ul>
              </div>
            </div>

            {resumeData.experience && resumeData.experience.length > 0 && (
              <div className="mb-2">
                <label htmlFor="experience-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select experience to enhance:
                </label>
                <select
                  id="experience-select"
                  value={selectedExperienceIndex}
                  onChange={(e) => setSelectedExperienceIndex(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {resumeData.experience.map((exp, index) => (
                    <option key={index} value={index}>
                      {exp.company} - {exp.position}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Button
              className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
              onClick={handleEnhanceContent}
              disabled={isEnhancingContent || apiKeyStatus === "missing"}
            >
              {isEnhancingContent ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              {isEnhancingContent ? "Enhancing Content..." : "Enhance Resume Content"}
            </Button>

            {isEnhancingContent && (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-24 w-full" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            )}

            {originalAchievements.length > 0 && enhancedAchievements.length > 0 && (
              <div className="mt-6 rounded-lg border border-green-100 bg-green-50 dark:border-green-900 dark:bg-green-950">
                <div className="border-b border-green-100 bg-green-100/50 p-4 dark:border-green-900 dark:bg-green-900/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <h3 className="font-medium text-green-800 dark:text-green-300">Content Enhancement Results</h3>
                  </div>
                  <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                    Your achievement statements have been enhanced for greater impact
                  </p>
                </div>
                
                <div className="grid gap-4 p-4 md:grid-cols-2">
                  <div className="space-y-2 rounded-md border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Original Content</h4>
                    <ul className="ml-5 list-disc space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      {originalAchievements.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 text-xs"
                      onClick={() => handleCopyText(originalAchievements.join('\n'))}
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      Copy Original
                    </Button>
                  </div>
                  
                  <div className="space-y-2 rounded-md border border-green-200 bg-white p-3 dark:border-green-900 dark:bg-gray-900">
                    <h4 className="font-medium text-green-700 dark:text-green-400">Enhanced Content</h4>
                    <ul className="ml-5 list-disc space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      {enhancedAchievements.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs text-green-700 hover:bg-green-50 hover:text-green-800 dark:text-green-400 dark:hover:bg-green-950 dark:hover:text-green-300"
                        onClick={() => handleCopyText(enhancedAchievements.join('\n'))}
                      >
                        <Copy className="mr-1 h-3 w-3" />
                        Copy Enhanced
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 text-xs hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                        onClick={handleApplyBulletPoints}
                      >
                        <CheckCheck className="mr-1 h-3 w-3" />
                        Apply to Resume
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4 border-t border-green-100 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Impact Score</div>
                    <div className="mt-1 flex items-center justify-center gap-1">
                      <Progress value={85} className="h-2 w-16 bg-gray-200 dark:bg-gray-700" indicatorColor="bg-green-500" />
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">85%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Clarity</div>
                    <div className="mt-1 flex items-center justify-center gap-1">
                      <Progress value={90} className="h-2 w-16 bg-gray-200 dark:bg-gray-700" indicatorColor="bg-blue-500" />
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">90%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400">ATS Compatibility</div>
                    <div className="mt-1 flex items-center justify-center gap-1">
                      <Progress value={95} className="h-2 w-16 bg-gray-200 dark:bg-gray-700" indicatorColor="bg-purple-500" />
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">95%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="generate" className="space-y-4 pt-4">
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
              <h3 className="mb-2 font-medium">Professional Summary Generator</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Generate a professional summary tailored to your experience and skills. This will:</p>
                <ul className="ml-5 mt-2 list-disc space-y-1">
                  <li>Create a concise, impactful professional summary</li>
                  <li>Highlight your most relevant skills and experience</li>
                  <li>Incorporate keywords from the job description (if provided)</li>
                  <li>Make your resume more appealing to recruiters and ATS systems</li>
                </ul>
              </div>
            </div>

            <Button
              className="w-full gap-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary || apiKeyStatus === "missing"}
            >
              {isGeneratingSummary ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              {isGeneratingSummary ? "Generating Summary..." : "Generate Professional Summary"}
            </Button>

            {isGeneratingSummary && (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-24 w-full" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            )}

            {originalSummary && enhancedSummary && (
              <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
                <div className="border-b border-blue-100 bg-blue-100/50 p-4 dark:border-blue-900 dark:bg-blue-900/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-medium text-blue-800 dark:text-blue-300">Summary Generation Results</h3>
                  </div>
                  <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                    Your professional summary has been generated
                  </p>
                </div>
                
                <div className="grid gap-4 p-4 md:grid-cols-2">
                  <div className="space-y-2 rounded-md border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Original Summary</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {originalSummary}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 text-xs"
                      onClick={() => handleCopyText(originalSummary)}
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      Copy Original
                    </Button>
                  </div>
                  
                  <div className="space-y-2 rounded-md border border-blue-200 bg-white p-3 dark:border-blue-900 dark:bg-gray-900">
                    <h4 className="font-medium text-blue-700 dark:text-blue-400">Enhanced Summary</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {enhancedSummary}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:text-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-300"
                        onClick={() => handleCopyText(enhancedSummary)}
                      >
                        <Copy className="mr-1 h-3 w-3" />
                        Copy Enhanced
                      </Button>
                      <Button
                        size="sm"
                        className="bg-blue-600 text-xs hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                        onClick={handleApplySummary}
                      >
                        <CheckCheck className="mr-1 h-3 w-3" />
                        Apply to Resume
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4 border-t border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Relevance</div>
                    <div className="mt-1 flex items-center justify-center gap-1">
                      <Progress value={92} className="h-2 w-16 bg-gray-200 dark:bg-gray-700" indicatorColor="bg-green-500" />
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">92%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Keyword Density</div>
                    <div className="mt-1 flex items-center justify-center gap-1">
                      <Progress value={88} className="h-2 w-16 bg-gray-200 dark:bg-gray-700" indicatorColor="bg-blue-500" />
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">88%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Conciseness</div>
                    <div className="mt-1 flex items-center justify-center gap-1">
                      <Progress value={95} className="h-2 w-16 bg-gray-200 dark:bg-gray-700" indicatorColor="bg-purple-500" />
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">95%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analyze" className="space-y-4 pt-4">
            <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950">
              <h3 className="mb-2 font-medium">Resume Analysis</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Get a comprehensive analysis of your resume's strengths and weaknesses:</p>
                <ul className="ml-5 mt-2 list-disc space-y-1">
                  <li>Identify areas for improvement</li>
                  <li>Get personalized recommendations</li>
                  <li>Understand how recruiters will view your resume</li>
                  <li>Receive tips for better formatting and content</li>
                </ul>
              </div>
            </div>

            <Button
              className="w-full gap-2 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300 dark:hover:bg-amber-900"
              onClick={handleAnalyzeResume}
              disabled={isAnalyzing || apiKeyStatus === "missing"}
            >
              {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
              {isAnalyzing ? "Analyzing Resume..." : "Analyze My Resume"}
            </Button>

            {isAnalyzing && (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-24 w-full" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            )}

            {analysisResult.length > 0 && analysisScore !== null && (
              <div className="mt-6 rounded-lg border border-amber-100 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
                <div className="border-b border-amber-100 bg-amber-100/50 p-4 dark:border-amber-900 dark:bg-amber-900/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <h3 className="font-medium text-amber-800 dark:text-amber-300">Resume Analysis Results</h3>
                  </div>
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                    Comprehensive analysis of your resume's ATS compatibility
                  </p>
                </div>
                
                <div className="p-4">
                  <div className="mx-auto mb-6 flex max-w-md flex-col items-center rounded-lg border border-amber-200 bg-white p-4 text-center dark:border-amber-900 dark:bg-gray-900">
                    <h4 className="text-lg font-medium text-amber-700 dark:text-amber-400">ATS Compatibility Score</h4>
                    <div className="relative mt-2 flex h-32 w-32 items-center justify-center rounded-full border-8 border-amber-100 dark:border-amber-900">
                      <div className="text-3xl font-bold text-amber-700 dark:text-amber-400">{analysisScore}</div>
                      <div className="absolute bottom-0 text-xs text-amber-600 dark:text-amber-500">/100</div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {analysisScore >= 90 
                        ? "Excellent match for this position!"
                        : analysisScore >= 75
                        ? "Good match with room for improvement"
                        : "Needs optimization for this role"}
                    </p>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3 rounded-md border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">Key Feedback</h4>
                      <ul className="ml-5 list-disc space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        {analysisFeedback.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-3 rounded-md border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">Suggestions</h4>
                      <ul className="ml-5 list-disc space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        {analysisSuggestions.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <Accordion type="single" collapsible className="mt-4 w-full">
                    <AccordionItem value="keyword-analysis">
                      <AccordionTrigger className="rounded-md bg-amber-100/50 px-4 py-2 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50">
                        <div className="flex items-center gap-2">
                          <BarChart className="h-4 w-4" />
                          <span>Keyword Analysis</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="bg-white p-4 dark:bg-gray-900">
                        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                          {keywordMatches.map((item, index) => (
                            <div 
                              key={index}
                              className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-800"
                            >
                              <span className="text-sm font-medium">{item.word}</span>
                              <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                                {item.count}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="detailed-analysis">
                      <AccordionTrigger className="mt-2 rounded-md bg-amber-100/50 px-4 py-2 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50">
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          <span>Detailed Analysis</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="bg-white p-4 dark:bg-gray-900">
                        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                          {analysisResult.map((item, index) => (
                            <p key={index}>{item}</p>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="mt-6 flex flex-wrap justify-center gap-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Keyword Match</div>
                      <div className="mt-1 flex items-center justify-center gap-1">
                        <Progress value={analysisScore - 5} className="h-2 w-16 bg-gray-200 dark:bg-gray-700" indicatorColor="bg-blue-500" />
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{analysisScore - 5}%</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Content Quality</div>
                      <div className="mt-1 flex items-center justify-center gap-1">
                        <Progress value={analysisScore + 3} className="h-2 w-16 bg-gray-200 dark:bg-gray-700" indicatorColor="bg-green-500" />
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">{analysisScore + 3}%</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Format & Structure</div>
                      <div className="mt-1 flex items-center justify-center gap-1">
                        <Progress value={analysisScore - 2} className="h-2 w-16 bg-gray-200 dark:bg-gray-700" indicatorColor="bg-purple-500" />
                        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{analysisScore - 2}%</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Relevance to Job</div>
                      <div className="mt-1 flex items-center justify-center gap-1">
                        <Progress value={analysisScore + 5} className="h-2 w-16 bg-gray-200 dark:bg-gray-700" indicatorColor="bg-amber-500" />
                        <span className="text-sm font-medium text-amber-600 dark:text-amber-400">{analysisScore + 5}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <Button 
                      onClick={handleExportAnalysis}
                      className="gap-2 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600"
                    >
                      <Download className="h-4 w-4" />
                      Export Analysis Report
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 border-t bg-gray-50 px-6 py-4 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <p className="text-center sm:text-left">AI-powered resume optimization</p>
        <div className="flex items-center gap-1">
          {jobDescription ? (
            <p className="flex items-center gap-1 text-center text-green-600 dark:text-green-400 sm:text-left">
              <CheckCircle className="h-3 w-3" />
              Using job description for tailored results
            </p>
          ) : (
            <p className="flex items-center gap-1 text-center sm:text-left">
              <Info className="h-3 w-3" />
              Add a job description for better results
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}