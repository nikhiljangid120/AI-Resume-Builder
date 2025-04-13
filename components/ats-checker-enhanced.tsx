"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  Search,
  Loader2,
  FileText,
  Target,
  Lightbulb,
  Zap,
  Award,
} from "lucide-react"
import type { ResumeData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { analyzeResume } from "@/lib/resume-analysis"

interface ATSCheckerEnhancedProps {
  resumeData: ResumeData
  resumeText?: string
  jobDescription: string
  onJobDescriptionChange: (value: string) => void
}

export function ATSCheckerEnhanced({
  resumeData,
  resumeText,
  jobDescription,
  onJobDescriptionChange,
}: ATSCheckerEnhancedProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string[]>([])
  const [missingKeywords, setMissingKeywords] = useState<string[]>([])
  const [keywordMatches, setKeywordMatches] = useState<{ keyword: string; found: boolean }[]>([])
  const [improvementTips, setImprovementTips] = useState<string[]>([])
  const { toast } = useToast()
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Add this function to the component
  const handleAnalyzeResume = async () => {
    if (!jobDescription) {
      toast({
        title: "Job Description Required",
        description: "Please enter a job description to analyze your resume.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setSuccess(null)

    try {
      // Use our local analysis function instead of API call
      const analysis = await analyzeResume(resumeData, jobDescription)

      // Update state with analysis results
      setScore(analysis.score)
      setFeedback(analysis.feedback)
      setMissingKeywords(analysis.missingKeywords)
      setKeywordMatches(analysis.keywordMatches)
      setImprovementTips(analysis.improvementTips)

      setSuccess("Resume analysis completed!")
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed against the job description.",
        variant: "success",
      })
    } catch (error) {
      console.error("Error analyzing resume:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze resume. Please try again."
      setError(errorMessage)

      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = () => {
    if (!score) return "text-gray-600 dark:text-gray-400"
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getProgressColor = () => {
    if (!score) return "bg-gray-600"
    if (score >= 80) return "bg-green-600"
    if (score >= 60) return "bg-yellow-600"
    return "bg-red-600"
  }

  const getScoreLabel = () => {
    if (!score) return "Not Analyzed"
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Very Good"
    if (score >= 70) return "Good"
    if (score >= 60) return "Fair"
    return "Needs Improvement"
  }

  const getScoreBadgeClass = () => {
    if (!score) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    if (score >= 80) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    if (score >= 60) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  const calculateKeywordMatchPercentage = () => {
    if (keywordMatches.length === 0) return 0
    const matchedCount = keywordMatches.filter((match) => match.found).length
    return Math.round((matchedCount / keywordMatches.length) * 100)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-500" />
          ATS Resume Checker
          <Badge
            variant="outline"
            className="ml-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
          >
            AI-Powered
          </Badge>
        </CardTitle>
        <CardDescription>
          Analyze your resume against job descriptions to optimize for Applicant Tracking Systems
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              placeholder="Paste the job description here to analyze your resume for ATS compatibility..."
              className="h-32 resize-none"
              value={jobDescription}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              For best results, paste the complete job description including requirements and responsibilities.
            </p>
          </div>

          <Button
            onClick={handleAnalyzeResume}
            disabled={!jobDescription || isAnalyzing}
            className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Check Resume ATS Compatibility
              </>
            )}
          </Button>
        </div>

        {score !== null ? (
          <div className="space-y-6">
            {/* Score Overview */}
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative h-36 w-36">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-4xl font-bold ${getScoreColor()}`}>{score}%</span>
                  </div>
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    <circle
                      className="stroke-gray-200 dark:stroke-gray-700"
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      strokeWidth="8"
                    />
                    <circle
                      className={`${score >= 80 ? "stroke-green-500" : score >= 60 ? "stroke-yellow-500" : "stroke-red-500"}`}
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      strokeWidth="8"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * score) / 100}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className={getScoreBadgeClass()}>
                    {getScoreLabel()}
                  </Badge>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">ATS Compatibility Score</p>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                      <Zap className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-medium">Keyword Match Rate</h3>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      calculateKeywordMatchPercentage() >= 70
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    }
                  >
                    {calculateKeywordMatchPercentage()}%
                  </Badge>
                </div>
                <Progress
                  value={calculateKeywordMatchPercentage()}
                  className="mt-2 h-2"
                  indicatorClassName={calculateKeywordMatchPercentage() >= 70 ? "bg-green-600" : "bg-yellow-600"}
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Percentage of important job keywords found in your resume
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-amber-100 p-2 text-amber-600 dark:bg-amber-900 dark:text-amber-300">
                      <Award className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-medium">Missing Keywords</h3>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      missingKeywords.length === 0
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    }
                  >
                    {missingKeywords.length}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {missingKeywords.length > 0 ? (
                    missingKeywords.slice(0, 5).map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-100"
                      >
                        {keyword}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400">No missing keywords detected</p>
                  )}
                  {missingKeywords.length > 5 && (
                    <Badge variant="outline" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      +{missingKeywords.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Analysis Tabs */}
            <Tabs defaultValue="feedback" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="tips">Improvement Tips</TabsTrigger>
              </TabsList>

              <TabsContent value="feedback" className="mt-4 space-y-3">
                {feedback.length > 0 ? (
                  feedback.map((item, index) => (
                    <Alert
                      key={index}
                      variant="default"
                      className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950"
                    >
                      <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      <AlertDescription className="text-yellow-700 dark:text-yellow-200">{item}</AlertDescription>
                    </Alert>
                  ))
                ) : (
                  <Alert
                    variant="default"
                    className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
                  >
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertTitle className="text-green-800 dark:text-green-300">Great Job!</AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-200">
                      Your resume is well-optimized for ATS systems. Add a job description to get specific
                      recommendations.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="keywords" className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Keyword Analysis</CardTitle>
                    <CardDescription>Important keywords from the job description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {keywordMatches.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {keywordMatches.map((match, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className={
                                match.found
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                              }
                            >
                              {match.keyword} {match.found ? "✓" : "✗"}
                            </Badge>
                          ))}
                        </div>

                        {missingKeywords.length > 0 && (
                          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900 dark:bg-yellow-950">
                            <h4 className="mb-2 font-medium text-yellow-800 dark:text-yellow-200">Missing Keywords</h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                              Consider adding these keywords to your resume:
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {missingKeywords.map((keyword, index) => (
                                <Badge
                                  key={index}
                                  className="bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
                                >
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          No keyword analysis available. Click "Check Resume ATS Compatibility" to analyze your resume.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tips" className="mt-4 space-y-3">
                {improvementTips.length > 0 ? (
                  improvementTips.map((tip, index) => (
                    <Alert
                      key={index}
                      variant="default"
                      className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950"
                    >
                      <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <AlertDescription className="text-blue-700 dark:text-blue-200">{tip}</AlertDescription>
                    </Alert>
                  ))
                ) : (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      No improvement tips available. Click "Check Resume ATS Compatibility" to analyze your resume.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
            <FileText className="mx-auto h-8 w-8 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Resume Not Analyzed</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Paste a job description above and click "Check Resume ATS Compatibility" to analyze your resume.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-gray-50 px-6 py-3 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
        <p>Powered by Gemini AI</p>
        <p>Results are for guidance only</p>
      </CardFooter>
    </Card>
  )
}

// Helper function to generate resume text from resume data
function generateResumeText(resumeData: ResumeData): string {
  const { personalInfo, skills, experience, education, projects } = resumeData

  let text = ""

  // Personal Info
  text += `${personalInfo.name}\n`
  text += `${personalInfo.title}\n`
  text += `${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}\n`
  if (personalInfo.website) text += `${personalInfo.website}\n`
  text += "\n"

  // Summary
  if (personalInfo.summary) {
    text += "SUMMARY\n"
    text += `${personalInfo.summary}\n\n`
  }

  // Skills
  if (skills.length > 0) {
    text += "SKILLS\n"
    skills.forEach((category) => {
      text += `${category.name}: ${category.skills.map((skill) => skill.name).join(", ")}\n`
    })
    text += "\n"
  }

  // Experience
  if (experience.length > 0) {
    text += "EXPERIENCE\n"
    experience.forEach((exp) => {
      text += `${exp.position} | ${exp.company} | ${exp.startDate} - ${exp.endDate}\n`
      if (exp.location) text += `${exp.location}\n`
      if (exp.description) text += `${exp.description}\n`
      if (exp.achievements.length > 0) {
        exp.achievements.forEach((achievement) => {
          text += `• ${achievement}\n`
        })
      }
      text += "\n"
    })
  }

  // Education
  if (education.length > 0) {
    text += "EDUCATION\n"
    education.forEach((edu) => {
      text += `${edu.degree} in ${edu.field} | ${edu.institution} | ${edu.startDate} - ${edu.endDate}\n`
      if (edu.location) text += `${edu.location}\n`
      if (edu.description) text += `${edu.description}\n`
      text += "\n"
    })
  }

  // Projects
  if (projects.length > 0) {
    text += "PROJECTS\n"
    projects.forEach((project) => {
      text += `${project.name}\n`
      if (project.technologies) text += `Technologies: ${project.technologies}\n`
      if (project.description) text += `${project.description}\n`
      if (project.achievements.length > 0) {
        project.achievements.forEach((achievement) => {
          text += `• ${achievement}\n`
        })
      }
      if (project.link) text += `Link: ${project.link}\n`
      text += "\n"
    })
  }

  return text
}
