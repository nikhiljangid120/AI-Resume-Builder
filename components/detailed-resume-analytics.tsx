"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import type { ResumeData } from "@/lib/types"
import { CheckCircle, Loader2, BarChart2, Activity, Target, ThumbsUp, ThumbsDown, Sparkles, Award } from "lucide-react"

interface DetailedResumeAnalyticsProps {
  resumeData: ResumeData
  jobDescription?: string
  onJobDescriptionChange?: (value: string) => void
}

export function DetailedResumeAnalytics({
  resumeData,
  jobDescription = "",
  onJobDescriptionChange = () => { },
}: DetailedResumeAnalyticsProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [realTimeAnalysis, setRealTimeAnalysis] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisStep, setAnalysisStep] = useState("")
  const { toast } = useToast()

  // Analysis results state
  const [overallScore, setOverallScore] = useState<number | null>(null)
  const [keywordScore, setKeywordScore] = useState<number | null>(null)
  const [contentScore, setContentScore] = useState<number | null>(null)
  const [formatScore, setFormatScore] = useState<number | null>(null)
  const [readabilityScore, setReadabilityScore] = useState<number | null>(null)
  const [impactScore, setImpactScore] = useState<number | null>(null)
  const [industryFit, setIndustryFit] = useState<number | null>(null)
  const [missingKeywords, setMissingKeywords] = useState<string[]>([])
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([])
  const [sectionScores, setSectionScores] = useState<Record<string, number>>({})
  const [strengths, setStrengths] = useState<string[]>([])
  const [weaknesses, setWeaknesses] = useState<string[]>([])
  const [opportunities, setOpportunities] = useState<string[]>([])
  const [competitorComparison, setCompetitorComparison] = useState<any[]>([])
  const [industryBenchmarks, setIndustryBenchmarks] = useState<any[]>([])
  const [timelineData, setTimelineData] = useState<any[]>([])
  const [heatmapData, setHeatmapData] = useState<any[]>([])
  const [skillGapAnalysis, setSkillGapAnalysis] = useState<any[]>([])
  const [readabilityMetrics, setReadabilityMetrics] = useState<any>({})
  const [sentimentAnalysis, setSentimentAnalysis] = useState<any>({})
  const [atsSimulationResults, setAtsSimulationResults] = useState<any[]>([])
  const [improvementPriorities, setImprovementPriorities] = useState<any[]>([])

  // Effect for real-time analysis
  useEffect(() => {
    if (realTimeAnalysis && jobDescription.length > 50) {
      const debounceTimer = setTimeout(() => {
        handleAnalyzeResume()
      }, 1500)

      return () => clearTimeout(debounceTimer)
    }
  }, [jobDescription, realTimeAnalysis])

  // Function to analyze resume
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
    setAnalysisProgress(0)
    setAnalysisStep("Initializing analysis...")

    try {
      // Simulate analysis steps with progress updates
      await simulateAnalysisStep("Extracting keywords from job description...", 0, 10)
      await simulateAnalysisStep("Analyzing resume content against job requirements...", 10, 30)
      await simulateAnalysisStep("Evaluating section relevance and impact...", 30, 50)
      await simulateAnalysisStep("Performing competitive analysis...", 50, 70)
      await simulateAnalysisStep("Generating recommendations and insights...", 70, 90)
      await simulateAnalysisStep("Finalizing analysis results...", 90, 100)

      // Generate mock analysis results
      generateMockAnalysisResults()

      setAnalysisComplete(true)
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed in detail against the job description.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error analyzing resume:", error)
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Helper function to simulate analysis steps with progress
  const simulateAnalysisStep = async (step: string, startProgress: number, endProgress: number) => {
    setAnalysisStep(step)

    // Simulate progress
    for (let i = startProgress; i <= endProgress; i++) {
      setAnalysisProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 30))
    }
  }

  // Generate mock analysis results for demonstration
  const generateMockAnalysisResults = () => {
    // Overall scores
    setOverallScore(Math.floor(Math.random() * 20) + 70) // 70-90
    setKeywordScore(Math.floor(Math.random() * 25) + 65) // 65-90
    setContentScore(Math.floor(Math.random() * 20) + 70) // 70-90
    setFormatScore(Math.floor(Math.random() * 15) + 75) // 75-90
    setReadabilityScore(Math.floor(Math.random() * 20) + 70) // 70-90
    setImpactScore(Math.floor(Math.random() * 25) + 65) // 65-90
    setIndustryFit(Math.floor(Math.random() * 20) + 70) // 70-90

    // Keywords
    const mockMissingKeywords = [
      "cloud architecture",
      "kubernetes",
      "CI/CD pipeline",
      "agile methodology",
      "system design",
      "microservices",
      "RESTful APIs",
      "test-driven development",
    ]
    const mockMatchedKeywords = [
      "React",
      "JavaScript",
      "TypeScript",
      "Node.js",
      "full-stack development",
      "responsive design",
      "user experience",
      "front-end",
      "back-end",
    ]
    setMissingKeywords(mockMissingKeywords.slice(0, Math.floor(Math.random() * 5) + 3))
    setMatchedKeywords(mockMatchedKeywords.slice(0, Math.floor(Math.random() * 5) + 4))

    // Section scores
    setSectionScores({
      "Personal Info": Math.floor(Math.random() * 15) + 80,
      Skills: Math.floor(Math.random() * 20) + 70,
      Experience: Math.floor(Math.random() * 25) + 65,
      Education: Math.floor(Math.random() * 15) + 75,
      Projects: Math.floor(Math.random() * 20) + 70,
    })

    // Strengths, weaknesses, opportunities
    setStrengths([
      "Strong technical skills that align with job requirements",
      "Clear demonstration of project outcomes and achievements",
      "Well-structured resume with logical organization",
      "Effective use of action verbs in experience descriptions",
    ])

    setWeaknesses([
      "Missing some key technical keywords from job description",
      "Limited quantifiable achievements in work experience",
      "Professional summary could be more targeted to the role",
      "Some skills mentioned in job description not highlighted",
    ])

    setOpportunities([
      "Add missing technical keywords to skills section",
      "Quantify achievements with specific metrics and outcomes",
      "Tailor professional summary to emphasize relevant experience",
      "Reorganize skills to prioritize those mentioned in job description",
    ])

    // Competitor comparison
    setCompetitorComparison([
      { name: "Your Resume", score: Math.floor(Math.random() * 20) + 70, color: "#8884d8" },
      { name: "Average Applicant", score: Math.floor(Math.random() * 10) + 60, color: "#82ca9d" },
      { name: "Top 10% Applicants", score: Math.floor(Math.random() * 10) + 85, color: "#ffc658" },
    ])

    // Industry benchmarks
    setIndustryBenchmarks([
      { name: "Technical Skills", industry: 75, you: Math.floor(Math.random() * 30) + 65 },
      { name: "Experience", industry: 70, you: Math.floor(Math.random() * 30) + 65 },
      { name: "Education", industry: 80, you: Math.floor(Math.random() * 20) + 70 },
      { name: "Projects", industry: 65, you: Math.floor(Math.random() * 30) + 65 },
      { name: "Soft Skills", industry: 60, you: Math.floor(Math.random() * 30) + 60 },
    ])

    // Timeline data
    setTimelineData([
      { name: "Initial Screening", pass: Math.random() > 0.3, probability: Math.floor(Math.random() * 20) + 70 },
      { name: "ATS Filtering", pass: Math.random() > 0.3, probability: Math.floor(Math.random() * 20) + 65 },
      { name: "Recruiter Review", pass: Math.random() > 0.4, probability: Math.floor(Math.random() * 25) + 60 },
      { name: "Hiring Manager", pass: Math.random() > 0.5, probability: Math.floor(Math.random() * 30) + 55 },
    ])

    // Heatmap data (keyword relevance)
    setHeatmapData([
      { section: "Summary", relevance: Math.floor(Math.random() * 40) + 60 },
      { section: "Skills", relevance: Math.floor(Math.random() * 30) + 70 },
      { section: "Experience", relevance: Math.floor(Math.random() * 25) + 65 },
      { section: "Projects", relevance: Math.floor(Math.random() * 35) + 60 },
      { section: "Education", relevance: Math.floor(Math.random() * 40) + 50 },
    ])

    // Skill gap analysis
    setSkillGapAnalysis([
      { name: "Technical Skills", required: 90, current: Math.floor(Math.random() * 30) + 60 },
      { name: "Leadership", required: 70, current: Math.floor(Math.random() * 40) + 50 },
      { name: "Communication", required: 80, current: Math.floor(Math.random() * 30) + 60 },
      { name: "Problem Solving", required: 85, current: Math.floor(Math.random() * 25) + 65 },
      { name: "Team Collaboration", required: 75, current: Math.floor(Math.random() * 20) + 70 },
    ])

    // Readability metrics
    setReadabilityMetrics({
      fleschReadingEase: Math.floor(Math.random() * 20) + 60,
      avgSentenceLength: Math.floor(Math.random() * 5) + 12,
      avgWordLength: Math.round((Math.random() * 2 + 4) * 10) / 10,
      passiveVoice: Math.floor(Math.random() * 15),
      jargonDensity: Math.floor(Math.random() * 20) + 10,
    })

    // Sentiment analysis
    setSentimentAnalysis({
      positive: Math.floor(Math.random() * 20) + 60,
      neutral: Math.floor(Math.random() * 20) + 20,
      negative: Math.floor(Math.random() * 10) + 5,
      confidence: Math.floor(Math.random() * 15) + 80,
    })

    // ATS simulation results
    setAtsSimulationResults([
      { system: "Workday", result: Math.random() > 0.3 ? "Pass" : "Fail", score: Math.floor(Math.random() * 30) + 65 },
      { system: "Taleo", result: Math.random() > 0.3 ? "Pass" : "Fail", score: Math.floor(Math.random() * 30) + 65 },
      {
        system: "Greenhouse",
        result: Math.random() > 0.3 ? "Pass" : "Fail",
        score: Math.floor(Math.random() * 30) + 65,
      },
      { system: "Lever", result: Math.random() > 0.3 ? "Pass" : "Fail", score: Math.floor(Math.random() * 30) + 65 },
    ])

    // Improvement priorities
    setImprovementPriorities([
      { area: "Keyword Optimization", priority: "High", impact: Math.floor(Math.random() * 20) + 75 },
      { area: "Quantifiable Achievements", priority: "Medium", impact: Math.floor(Math.random() * 20) + 70 },
      { area: "Technical Skills", priority: "High", impact: Math.floor(Math.random() * 15) + 80 },
      { area: "Professional Summary", priority: "Medium", impact: Math.floor(Math.random() * 25) + 65 },
    ])
  }

  // Helper function to get color based on score
  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-gray-500"
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  // Helper function to get badge class based on score
  const getScoreBadgeClass = (score: number | null) => {
    if (score === null) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    if (score >= 80) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    if (score >= 60) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  // Helper function to get score label
  const getScoreLabel = (score: number | null) => {
    if (score === null) return "Not Analyzed"
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Very Good"
    if (score >= 70) return "Good"
    if (score >= 60) return "Fair"
    return "Needs Improvement"
  }

  // Helper function to get progress color
  const getProgressColor = (score: number | null) => {
    if (score === null) return "bg-gray-600"
    if (score >= 80) return "bg-green-600"
    if (score >= 60) return "bg-yellow-600"
    return "bg-red-600"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-purple-500" />
          Advanced Resume Analytics
          <Badge
            variant="outline"
            className="ml-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
          >
            AI-Powered
          </Badge>
        </CardTitle>
        <CardDescription>
          Comprehensive resume analysis with detailed visualizations and real-time insights
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
              disabled={isAnalyzing}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              For best results, paste the complete job description including requirements and responsibilities.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="real-time"
                checked={realTimeAnalysis}
                onCheckedChange={setRealTimeAnalysis}
                disabled={isAnalyzing}
              />
              <Label htmlFor="real-time" className="text-sm">
                Real-time Analysis
              </Label>
            </div>

            <Button
              onClick={handleAnalyzeResume}
              disabled={!jobDescription || isAnalyzing}
              className="gap-2 bg-purple-600 hover:bg-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze Resume
                </>
              )}
            </Button>
          </div>

          {isAnalyzing && (
            <div className="space-y-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{analysisStep}</span>
                </div>
                <span className="text-sm font-medium">{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
            </div>
          )}
        </div>

        {analysisComplete && overallScore !== null ? (
          <div className="space-y-6">
            {/* Score Overview */}
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative h-36 w-36">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}%</span>
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
                        className={`${overallScore >= 80
                            ? "stroke-green-500"
                            : overallScore >= 60
                              ? "stroke-yellow-500"
                              : "stroke-red-500"
                          }`}
                        cx="50"
                        cy="50"
                        r="45"
                        fill="transparent"
                        strokeWidth="8"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * overallScore) / 100}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <Badge className={getScoreBadgeClass(overallScore)}>{getScoreLabel(overallScore)}</Badge>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Overall Resume Score</p>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Keyword Match</span>
                        <span className={`text-sm font-bold ${getScoreColor(keywordScore)}`}>{keywordScore}%</span>
                      </div>
                      <Progress
                        value={keywordScore || 0}
                        className="h-2"
                        indicatorClassName={getProgressColor(keywordScore)}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Content Quality</span>
                        <span className={`text-sm font-bold ${getScoreColor(contentScore)}`}>{contentScore}%</span>
                      </div>
                      <Progress
                        value={contentScore || 0}
                        className="h-2"
                        indicatorClassName={getProgressColor(contentScore)}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Format & Structure</span>
                        <span className={`text-sm font-bold ${getScoreColor(formatScore)}`}>{formatScore}%</span>
                      </div>
                      <Progress
                        value={formatScore || 0}
                        className="h-2"
                        indicatorClassName={getProgressColor(formatScore)}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Readability</span>
                        <span className={`text-sm font-bold ${getScoreColor(readabilityScore)}`}>
                          {readabilityScore}%
                        </span>
                      </div>
                      <Progress
                        value={readabilityScore || 0}
                        className="h-2"
                        indicatorClassName={getProgressColor(readabilityScore)}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="text-sm font-medium">ATS Pass Probability</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Based on keyword match and formatting
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        overallScore >= 80
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : overallScore >= 60
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }
                    >
                      {overallScore >= 80 ? "High" : overallScore >= 60 ? "Medium" : "Low"}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    <Activity className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium">Impact Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(impactScore)}`}>{impactScore}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Effectiveness of achievements</p>
                </div>

                <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                    <Target className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium">Industry Fit</p>
                  <p className={`text-2xl font-bold ${getScoreColor(industryFit)}`}>{industryFit}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Alignment with industry standards</p>
                </div>

                <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300">
                    <Award className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium">Competitive Ranking</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    Top {Math.floor(Math.random() * 15) + 15}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Compared to similar applicants</p>
                </div>
              </div>
            </div>

            {/* Detailed Analysis Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="sections">Sections</TabsTrigger>
                <TabsTrigger value="competitive">Competitive</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Strengths */}
                  <Card>
                    <CardHeader className="bg-green-50 pb-2 dark:bg-green-900/20">
                      <CardTitle className="flex items-center gap-2 text-sm font-medium text-green-800 dark:text-green-300">
                        <ThumbsUp className="h-4 w-4" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="space-y-2">
                        {strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                            <span className="text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Weaknesses */}
                  <Card>
                    <CardHeader className="bg-red-50 pb-2 dark:bg-red-900/20">
                      <CardTitle className="flex items-center gap-2 text-sm font-medium text-red-800 dark:text-red-300">
                        <ThumbsDown className="h-4 w-4" />
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="space-y-2">
                        {weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <ThumbsDown className="mt-0.5 h-4 w-4 text-red-600" />
                            <span className="text-sm">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Opportunities */}
                <Card>
                  <CardHeader className="bg-blue-50 pb-2 dark:bg-blue-900/20">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-blue-300">
                      <Sparkles className="h-4 w-4" />
                      Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-2">
                      {opportunities.map((opportunity, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Sparkles className="mt-0.5 h-4 w-4 text-blue-600" />
                          <span className="text-sm">{opportunity}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="keywords" className="mt-4 space-y-4">
                {/* Missing Keywords */}
                <Card>
                  <CardHeader className="bg-red-50 pb-2 dark:bg-red-900/20">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-red-800 dark:text-red-300">
                      <ThumbsDown className="h-4 w-4" />
                      Missing Keywords
                    </CardTitle>
                    <CardDescription>Keywords from the job description not found in your resume</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {missingKeywords.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {missingKeywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No missing keywords found.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Matched Keywords */}
                <Card>
                  <CardHeader className="bg-green-50 pb-2 dark:bg-green-900/20">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-green-800 dark:text-green-300">
                      <ThumbsUp className="h-4 w-4" />
                      Matched Keywords
                    </CardTitle>
                    <CardDescription>Keywords from the job description found in your resume</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {matchedKeywords.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {matchedKeywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No matched keywords found.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sections" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(sectionScores).map(([section, score]) => (
                    <Card key={section}>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">{section}</CardTitle>
                        <CardDescription>Relevance and impact of this section</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Score</span>
                          <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}%</span>
                        </div>
                        <Progress value={score} className="h-2" indicatorClassName={getProgressColor(score)} />
                        <Badge className={getScoreBadgeClass(score)}>{getScoreLabel(score)}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="competitive" className="mt-4 space-y-4">
                {/* Competitor Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Competitor Comparison</CardTitle>
                    <CardDescription>How your resume stacks up against other applicants</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Placeholder for chart or table */}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Chart or table comparing your resume score with average and top applicants.
                    </p>
                  </CardContent>
                </Card>

                {/* Industry Benchmarks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Industry Benchmarks</CardTitle>
                    <CardDescription>
                      Comparison of your skills and experience against industry standards
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Placeholder for chart or table */}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Chart or table comparing your skills and experience with industry benchmarks.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="mt-4 space-y-4">
                {/* Improvement Priorities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Improvement Priorities</CardTitle>
                    <CardDescription>Key areas to focus on for resume improvement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Placeholder for list of recommendations */}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      List of prioritized recommendations for improving your resume.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          !isAnalyzing && (
            <div className="text-center text-gray-500 dark:text-gray-400">
              Enter a job description and click "Analyze Resume" to get started.
            </div>
          )
        )}
      </CardContent>
    </Card>
  )
}
