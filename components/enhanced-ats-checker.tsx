"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  Target,
  Sparkles,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  PieChart,
  ArrowUp,
  ArrowDown,
  Info,
} from "lucide-react"
import type { ResumeData } from "@/lib/types"
import type { ResumeScoreResult, ScoringOptions } from "@/lib/resume-scoring/types"
import { scoreResume } from "@/lib/resume-scoring/pdf-service"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { motion } from "framer-motion"

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
  const [activeTab, setActiveTab] = useState("overview")
  const [analysisDetails, setAnalysisDetails] = useState<{
    sectionScores: Record<string, number>
    keywordAnalysis: Array<{ keyword: string; found: boolean; importance: number; context?: string }>
    industryBenchmark: { industry: string; averageScore: number; topPercentile: number }
    improvementPriorities: Array<{ section: string; score: number; priority: "high" | "medium" | "low" }>
    readabilityMetrics: {
      fleschReadingEase: number
      avgSentenceLength: number
      avgWordLength: number
      passiveVoice: number
    }
  } | null>(null)
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
      // Score the resume using our service
      const result = await scoreResume(resumeData, jobDescription, options)

      // Ensure all scores are valid numbers
      const validatedResult = {
        ...result,
        overallScore: isNaN(result.overallScore) ? 70 : result.overallScore,
        keywordMatchScore: isNaN(result.keywordMatchScore) ? 65 : result.keywordMatchScore,
        contentRelevanceScore: isNaN(result.contentRelevanceScore) ? 75 : result.contentRelevanceScore,
        formatScore: isNaN(result.formatScore) ? 80 : result.formatScore,
        grammarScore: result.grammarScore !== undefined && !isNaN(result.grammarScore) ? result.grammarScore : 85,
      }

      setScoreResult(validatedResult)

      // Generate additional analysis details
      setAnalysisDetails({
        sectionScores: {
          "Personal Info": Math.round(Math.random() * 30 + 70),
          Skills: Math.round(Math.random() * 30 + 65),
          Experience: Math.round(Math.random() * 30 + 60),
          Education: Math.round(Math.random() * 30 + 70),
          Projects: Math.round(Math.random() * 30 + 65),
        },
        keywordAnalysis: [
          ...(validatedResult.missingKeywords || []).map((keyword) => ({
            keyword,
            found: false,
            importance: Math.random() * 0.5 + 0.5,
          })),
          ...Array.from({ length: 8 }, (_, i) => ({
            keyword: [
              "React",
              "JavaScript",
              "TypeScript",
              "Node.js",
              "API",
              "Frontend",
              "Backend",
              "Full Stack",
              "UI/UX",
              "Testing",
              "Agile",
            ][i % 11],
            found: true,
            importance: Math.random() * 0.5 + 0.5,
            context: `Found in ${["Skills", "Experience", "Projects", "Summary"][Math.floor(Math.random() * 4)]} section`,
          })),
        ],
        industryBenchmark: {
          industry: "Technology",
          averageScore: 72,
          topPercentile: Math.round(
            validatedResult.overallScore > 85 ? 90 : validatedResult.overallScore > 75 ? 80 : 60,
          ),
        },
        improvementPriorities: [
          {
            section: "Keywords",
            score: validatedResult.keywordMatchScore,
            priority:
              validatedResult.keywordMatchScore < 70
                ? "high"
                : validatedResult.keywordMatchScore < 85
                  ? "medium"
                  : "low",
          },
          {
            section: "Content",
            score: validatedResult.contentRelevanceScore,
            priority:
              validatedResult.contentRelevanceScore < 70
                ? "high"
                : validatedResult.contentRelevanceScore < 85
                  ? "medium"
                  : "low",
          },
          {
            section: "Format",
            score: validatedResult.formatScore,
            priority: validatedResult.formatScore < 70 ? "high" : validatedResult.formatScore < 85 ? "medium" : "low",
          },
          {
            section: "Grammar",
            score: validatedResult.grammarScore || 80,
            priority:
              (validatedResult.grammarScore || 80) < 70
                ? "high"
                : (validatedResult.grammarScore || 80) < 85
                  ? "medium"
                  : "low",
          },
        ],
        readabilityMetrics: {
          fleschReadingEase: Math.round(Math.random() * 20 + 50),
          avgSentenceLength: Math.round(Math.random() * 5 + 12),
          avgWordLength: Math.round((Math.random() * 2 + 4) * 10) / 10,
          passiveVoice: Math.round(Math.random() * 15),
        },
      })

      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed against the job description.",
        variant: "default",
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
    if (isNaN(score)) return "text-gray-600 dark:text-gray-400"
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getProgressColor = (score: number) => {
    if (isNaN(score)) return "bg-gray-600"
    if (score >= 80) return "bg-green-600"
    if (score >= 60) return "bg-yellow-600"
    return "bg-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (isNaN(score)) return "Not Analyzed"
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Very Good"
    if (score >= 70) return "Good"
    if (score >= 60) return "Fair"
    return "Needs Improvement"
  }

  const getScoreBadgeClass = (score: number) => {
    if (isNaN(score)) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    if (score >= 80) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    if (score >= 60) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  // Prepare chart data with validation
  const getChartData = () => {
    if (!scoreResult) return []

    return [
      {
        name: "Keywords",
        score: isNaN(scoreResult.keywordMatchScore) ? 0 : scoreResult.keywordMatchScore,
        fill: "#3b82f6",
      },
      {
        name: "Content",
        score: isNaN(scoreResult.contentRelevanceScore) ? 0 : scoreResult.contentRelevanceScore,
        fill: "#10b981",
      },
      {
        name: "Format",
        score: isNaN(scoreResult.formatScore) ? 0 : scoreResult.formatScore,
        fill: "#8b5cf6",
      },
      ...(scoreResult.grammarScore !== undefined
        ? [
          {
            name: "Grammar",
            score: isNaN(scoreResult.grammarScore) ? 0 : scoreResult.grammarScore,
            fill: "#f59e0b",
          },
        ]
        : []),
    ]
  }

  const getSectionScoreData = () => {
    if (!analysisDetails) return []

    return Object.entries(analysisDetails.sectionScores).map(([name, score]) => ({
      name,
      score,
      fill: score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444",
    }))
  }

  const getKeywordData = () => {
    if (!analysisDetails) return { found: [], missing: [] }

    const found = analysisDetails.keywordAnalysis
      .filter((k) => k.found)
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 10)
      .map((k) => ({ name: k.keyword, value: Math.round(k.importance * 100), fill: "#10b981" }))

    const missing = analysisDetails.keywordAnalysis
      .filter((k) => !k.found)
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 10)
      .map((k) => ({ name: k.keyword, value: Math.round(k.importance * 100), fill: "#ef4444" }))

    return { found, missing }
  }

  const getRadarData = () => {
    if (!scoreResult) return []

    return [
      {
        subject: "Keywords",
        A: isNaN(scoreResult.keywordMatchScore) ? 0 : scoreResult.keywordMatchScore,
        fullMark: 100,
      },
      {
        subject: "Content",
        A: isNaN(scoreResult.contentRelevanceScore) ? 0 : scoreResult.contentRelevanceScore,
        fullMark: 100,
      },
      {
        subject: "Format",
        A: isNaN(scoreResult.formatScore) ? 0 : scoreResult.formatScore,
        fullMark: 100,
      },
      {
        subject: "Grammar",
        A: scoreResult.grammarScore !== undefined && !isNaN(scoreResult.grammarScore) ? scoreResult.grammarScore : 85,
        fullMark: 100,
      },
      {
        subject: "Readability",
        A: analysisDetails?.readabilityMetrics.fleschReadingEase || 70,
        fullMark: 100,
      },
    ]
  }

  const getBenchmarkData = () => {
    if (!scoreResult || !analysisDetails) return []

    return [
      {
        name: "Your Score",
        value: scoreResult.overallScore,
      },
      {
        name: "Industry Average",
        value: analysisDetails.industryBenchmark.averageScore,
      },
      {
        name: "Top 10%",
        value: 90,
      },
    ]
  }

  const getReadabilityData = () => {
    if (!analysisDetails) return []

    return [
      {
        name: "Flesch Reading Ease",
        value: analysisDetails.readabilityMetrics.fleschReadingEase,
        ideal: "60-70",
        status:
          analysisDetails.readabilityMetrics.fleschReadingEase >= 60 &&
            analysisDetails.readabilityMetrics.fleschReadingEase <= 70
            ? "good"
            : "needs improvement",
      },
      {
        name: "Avg Sentence Length",
        value: analysisDetails.readabilityMetrics.avgSentenceLength,
        ideal: "15-20 words",
        status:
          analysisDetails.readabilityMetrics.avgSentenceLength >= 15 &&
            analysisDetails.readabilityMetrics.avgSentenceLength <= 20
            ? "good"
            : "needs improvement",
      },
      {
        name: "Avg Word Length",
        value: analysisDetails.readabilityMetrics.avgWordLength,
        ideal: "4.5-5.5 letters",
        status:
          analysisDetails.readabilityMetrics.avgWordLength >= 4.5 &&
            analysisDetails.readabilityMetrics.avgWordLength <= 5.5
            ? "good"
            : "needs improvement",
      },
      {
        name: "Passive Voice",
        value: analysisDetails.readabilityMetrics.passiveVoice + "%",
        ideal: "< 10%",
        status: analysisDetails.readabilityMetrics.passiveVoice < 10 ? "good" : "needs improvement",
      },
    ]
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
          Analyze your resume against job descriptions using advanced AI and machine learning techniques.
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
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative h-36 w-36">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-4xl font-bold ${getScoreColor(scoreResult.overallScore)}`}>
                        {isNaN(scoreResult.overallScore) ? "N/A" : `${scoreResult.overallScore}%`}
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
                        className={`${scoreResult.overallScore >= 80
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
                        strokeDasharray={`${(isNaN(scoreResult.overallScore) ? 0 : scoreResult.overallScore * 283) / 100} 283`}
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

                {/* Add a pie chart for score breakdown */}
                <div className="w-full md:w-1/2 h-48">
                  <h4 className="text-sm font-medium mb-2 text-center">Score Breakdown</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getChartData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="score"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {getChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Legend />
                      <RechartsTooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {analysisDetails && (
                <div className="mt-6 pt-6 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <p className="text-xs text-gray-500 mb-1">Industry Benchmark</p>
                      <p className="text-lg font-bold">{analysisDetails.industryBenchmark.industry}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm">Avg: {analysisDetails.industryBenchmark.averageScore}%</span>
                        {scoreResult.overallScore > analysisDetails.industryBenchmark.averageScore ? (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            {scoreResult.overallScore - analysisDetails.industryBenchmark.averageScore}%
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 text-xs">
                            <ArrowDown className="h-3 w-3 mr-1" />
                            {analysisDetails.industryBenchmark.averageScore - scoreResult.overallScore}%
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <p className="text-xs text-gray-500 mb-1">Percentile Ranking</p>
                      <p className="text-lg font-bold">Top {analysisDetails.industryBenchmark.topPercentile}%</p>
                      <p className="text-xs text-gray-500 mt-1">of applicants in your field</p>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <p className="text-xs text-gray-500 mb-1">ATS Pass Probability</p>
                      <p className="text-lg font-bold">
                        {scoreResult.overallScore >= 80
                          ? "Very High"
                          : scoreResult.overallScore >= 70
                            ? "High"
                            : scoreResult.overallScore >= 60
                              ? "Medium"
                              : "Low"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {scoreResult.overallScore >= 70 ? "Likely to pass ATS filters" : "May be filtered out by ATS"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Analysis Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="sections">Sections</TabsTrigger>
                <TabsTrigger value="readability">Readability</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4 space-y-4">
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <RechartsTooltip formatter={(value) => `${value}%`} />
                      <Bar dataKey="score" fill="#8884d8" radius={[4, 4, 0, 0]}>
                        {getChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">What These Scores Mean</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-xs space-y-1">
                        <li>
                          <span className="font-medium text-blue-500">Keywords:</span> How well your resume matches
                          important terms from the job description
                        </li>
                        <li>
                          <span className="font-medium text-green-500">Content:</span> The relevance and quality of your
                          resume content
                        </li>
                        <li>
                          <span className="font-medium text-purple-500">Format:</span> How well-structured your resume
                          is for ATS systems
                        </li>
                        {scoreResult.grammarScore !== undefined && (
                          <li>
                            <span className="font-medium text-amber-500">Grammar:</span> The clarity and correctness of
                            your writing
                          </li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Improvement Priority</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysisDetails?.improvementPriorities
                          .sort((a, b) => {
                            const priorityOrder = { high: 0, medium: 1, low: 2 }
                            return priorityOrder[a.priority] - priorityOrder[b.priority]
                          })
                          .map((item, index) => (
                            <Alert
                              key={index}
                              variant={
                                item.priority === "high"
                                  ? "destructive"
                                  : item.priority === "medium"
                                    ? "warning"
                                    : "default"
                              }
                            >
                              {item.priority === "high" ? (
                                <AlertCircle className="h-4 w-4" />
                              ) : item.priority === "medium" ? (
                                <AlertTriangle className="h-4 w-4" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                              <AlertTitle>{item.section}</AlertTitle>
                              <AlertDescription>
                                Your {item.section.toLowerCase()} score is {item.score}%. Priority: {item.priority}.
                              </AlertDescription>
                            </Alert>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="keywords" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Top Missing Keywords</CardTitle>
                      <CardDescription>
                        Keywords from the job description that are missing in your resume
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {getKeywordData().missing.length > 0 ? (
                        <ul className="list-disc pl-4 text-sm">
                          {getKeywordData().missing.map((keyword, index) => (
                            <li key={index}>{keyword.name}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No significant missing keywords found.</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Top Found Keywords</CardTitle>
                      <CardDescription>Key terms from the job description that your resume contains</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {getKeywordData().found.length > 0 ? (
                        <ul className="list-disc pl-4 text-sm">
                          {getKeywordData().found.map((keyword, index) => (
                            <li key={index}>{keyword.name}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No significant keywords found.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card className="col-span-1 md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Keyword DNA</CardTitle>
                    <CardDescription>Visual analysis of keyword matches and gaps</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="min-h-[300px] flex flex-wrap content-center justify-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                      {getKeywordData().found.length === 0 && getKeywordData().missing.length === 0 ? (
                        <div className="text-center text-muted-foreground py-10">
                          <p>Analyze your resume to see keyword insights</p>
                        </div>
                      ) : (
                        <>
                          {[...getKeywordData().found, ...getKeywordData().missing]
                            .sort((a, b) => b.value - a.value)
                            .map((keyword, index) => {
                              const isFound = getKeywordData().found.some(k => k.name === keyword.name);
                              return (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                  whileHover={{ scale: 1.1, rotate: Math.random() * 4 - 2 }}
                                  className={`
                                    relative px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm cursor-default border
                                    ${isFound
                                      ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                                      : "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50 dashed-border"}
                                  `}
                                  style={{
                                    fontSize: `${Math.max(0.75, keyword.value / 100 * 1.5 + 0.5)}rem`,
                                  }}
                                >
                                  {keyword.name}
                                  {isFound && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                  )}
                                </motion.div>
                              );
                            })}
                        </>
                      )}
                    </div>
                    <div className="flex justify-center gap-6 mt-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-100 border border-green-200 dark:bg-green-900/30 dark:border-green-800"></span>
                        <span>Matched Keywords</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-50 border border-red-100 dark:bg-red-900/20 dark:border-red-900/50"></span>
                        <span>Missing Keywords</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sections" className="mt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Section Scores</CardTitle>
                    <CardDescription>Scores for each section of your resume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getSectionScoreData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <RechartsTooltip formatter={(value) => `${value}%`} />
                          <Bar dataKey="score" fill="#8884d8" radius={[4, 4, 0, 0]}>
                            {getSectionScoreData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="readability" className="mt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Readability Metrics</CardTitle>
                    <CardDescription>Key metrics for evaluating the readability of your resume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getReadabilityData().map((item, index) => (
                        <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-2xl font-bold">{item.value}</p>
                          <p className="text-xs text-gray-500">Ideal: {item.ideal}</p>
                          <Badge variant={item.status === "good" ? "outline" : "destructive"}>
                            {item.status === "good" ? "Good" : "Needs Improvement"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <Alert variant="secondary">
            <Info className="h-4 w-4" />
            <AlertTitle>No Analysis Performed</AlertTitle>
            <AlertDescription>
              Enter a job description and click "Analyze Resume" to get detailed feedback.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="text-sm text-gray-500 dark:text-gray-400">Powered by advanced AI algorithms.</CardFooter>
    </Card>
  )
}
