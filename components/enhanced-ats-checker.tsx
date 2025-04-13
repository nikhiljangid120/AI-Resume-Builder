"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, Target, Sparkles } from "lucide-react"
import type { ResumeData } from "@/lib/types"
import type { ResumeScoreResult, ScoringOptions } from "@/lib/resume-scoring/types"
import { scoreResume } from "@/lib/resume-scoring/pdf-service"
import { useToast } from "@/hooks/use-toast"

interface EnhancedATSCheckerProps {
  resumeData: ResumeData
  resumeText?: string
  jobDescription: string
  onJobDescriptionChange: (value: string) => void
}

export function EnhancedATSChecker({
  resumeData,
  resumeText,
  jobDescription,
  onJobDescriptionChange,
}: EnhancedATSCheckerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [scoreResult, setScoreResult] = useState<ResumeScoreResult | null>(null)
  const [options, setOptions] = useState<ScoringOptions>({
    useEmbeddings: true,
    checkGrammar: true,
    includeContextForKeywords: true,
  })
  const { toast } = useToast()

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

    try {
      // Score the resume using our new service
      const result = await scoreResume(resumeData, jobDescription, options)
      setScoreResult(result)

      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed against the job description.",
        variant: "success",
      })
    } catch (error) {
      console.error("Error analyzing resume:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze resume. Please try again."

      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-600"
    if (score >= 60) return "bg-yellow-600"
    return "bg-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Very Good"
    if (score >= 70) return "Good"
    if (score >= 60) return "Fair"
    return "Needs Improvement"
  }

  const getScoreBadgeClass = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    if (score >= 60) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-500" />
          Advanced ATS Resume Checker
          <Badge
            variant="outline"
            className="ml-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
          >
            AI + ML Powered
          </Badge>
        </CardTitle>
        <CardDescription>
          Analyze your resume against job descriptions using advanced AI and machine learning techniques
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
              value={jobDescription || ""}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              For best results, paste the complete job description including requirements and responsibilities.
            </p>
          </div>

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Switch
                id="use-embeddings"
                checked={options.useEmbeddings}
                onCheckedChange={(checked) => setOptions({ ...options, useEmbeddings: checked })}
              />
              <Label htmlFor="use-embeddings" className="text-sm">
                Use AI Embeddings
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="check-grammar"
                checked={options.checkGrammar}
                onCheckedChange={(checked) => setOptions({ ...options, checkGrammar: checked })}
              />
              <Label htmlFor="check-grammar" className="text-sm">
                Check Grammar
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="include-context"
                checked={options.includeContextForKeywords}
                onCheckedChange={(checked) => setOptions({ ...options, includeContextForKeywords: checked })}
              />
              <Label htmlFor="include-context" className="text-sm">
                Include Keyword Context
              </Label>
            </div>
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
                <Sparkles className="h-4 w-4" />
                Analyze Resume with Advanced AI
              </>
            )}
          </Button>
        </div>

        {scoreResult ? (
          <div className="space-y-6">
            {/* Score Overview */}
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative h-36 w-36">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-4xl font-bold ${getScoreColor(scoreResult.overallScore)}`}>
                      {scoreResult.overallScore}%
                    </span>
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
                      className={`${
                        scoreResult.overallScore >= 80
                          ? "stroke-green-500"
                          : scoreResult.overallScore >= 60
                            ? "stroke-yellow-500"
                            : "stroke-red-500"
                      }`}
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      strokeWidth="8"
                      strokeDasharray={`${(scoreResult.overallScore * 283) / 100} 283`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <Badge className={`mb-1 ${getScoreBadgeClass(scoreResult.overallScore)}`}>
                    {getScoreLabel(scoreResult.overallScore)}
                  </Badge>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ATS Compatibility Score</p>
                </div>
              </div>
            </div>

            {/* Detailed Scores */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Detailed Analysis</h3>

              <div className="space-y-3">
                {/* Keyword Match */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Keyword Match</span>
                    <span className="text-sm font-medium">{scoreResult.keywordMatchScore}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-full ${getProgressColor(scoreResult.keywordMatchScore)}`}
                      style={{ width: `${scoreResult.keywordMatchScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Content Relevance */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Content Relevance</span>
                    <span className="text-sm font-medium">{scoreResult.contentRelevanceScore}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-full ${getProgressColor(scoreResult.contentRelevanceScore)}`}
                      style={{ width: `${scoreResult.contentRelevanceScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Format & Structure */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Format & Structure</span>
                    <span className="text-sm font-medium">{scoreResult.formatScore}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-full ${getProgressColor(scoreResult.formatScore)}`}
                      style={{ width: `${scoreResult.formatScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Grammar & Clarity */}
                {scoreResult.grammarScore !== undefined && (
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Grammar & Clarity</span>
                      <span className="text-sm font-medium">{scoreResult.grammarScore}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className={`h-full ${getProgressColor(scoreResult.grammarScore)}`}
                        style={{ width: `${scoreResult.grammarScore}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Missing Keywords */}
            {scoreResult.missingKeywords && scoreResult.missingKeywords.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Missing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {scoreResult.missingKeywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-100"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Consider adding these keywords to your resume to improve ATS compatibility.
                </p>
              </div>
            )}

            {/* Improvement Suggestions */}
            {scoreResult.suggestions && scoreResult.suggestions.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Improvement Suggestions</h3>
                <ul className="list-inside list-disc space-y-1 text-sm">
                  {scoreResult.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
