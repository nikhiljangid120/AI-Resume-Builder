"use client"

import { useState, useEffect } from "react"
import type { ResumeData } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Info, ThumbsUp, ThumbsDown, BarChart, Lightbulb } from "lucide-react"

interface ResumeAnalyzerProps {
  resumeData: ResumeData
}

export function ResumeAnalyzer({ resumeData }: ResumeAnalyzerProps) {
  const [analysis, setAnalysis] = useState({
    overallScore: 0,
    contentScore: 0,
    formatScore: 0,
    relevanceScore: 0,
    strengths: [] as string[],
    weaknesses: [] as string[],
    suggestions: [] as string[],
    sectionScores: {} as Record<string, number>,
  })

  useEffect(() => {
    // Analyze the resume when the component mounts or resumeData changes
    const newAnalysis = analyzeResume(resumeData)
    setAnalysis(newAnalysis)
  }, [resumeData])

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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-purple-500" />
          Resume Analysis
        </CardTitle>
        <CardDescription>
          Detailed analysis of your resume's strengths, weaknesses, and suggestions for improvement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Resume Score</h3>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${getScoreColor(analysis.overallScore)}`}>
                {analysis.overallScore}%
              </span>
              <Badge
                variant={analysis.overallScore >= 80 ? "default" : "outline"}
                className={
                  analysis.overallScore >= 80
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    : analysis.overallScore >= 60
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                }
              >
                {getScoreLabel(analysis.overallScore)}
              </Badge>
            </div>
          </div>
          <Progress
            value={analysis.overallScore}
            className="h-2"
            indicatorClassName={getProgressColor(analysis.overallScore)}
          />
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">Content Quality</h4>
              <span className={`text-sm font-bold ${getScoreColor(analysis.contentScore)}`}>
                {analysis.contentScore}%
              </span>
            </div>
            <Progress
              value={analysis.contentScore}
              className="h-1.5"
              indicatorClassName={getProgressColor(analysis.contentScore)}
            />
          </div>
          <div className="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">Format & Structure</h4>
              <span className={`text-sm font-bold ${getScoreColor(analysis.formatScore)}`}>
                {analysis.formatScore}%
              </span>
            </div>
            <Progress
              value={analysis.formatScore}
              className="h-1.5"
              indicatorClassName={getProgressColor(analysis.formatScore)}
            />
          </div>
          <div className="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">Relevance & Impact</h4>
              <span className={`text-sm font-bold ${getScoreColor(analysis.relevanceScore)}`}>
                {analysis.relevanceScore}%
              </span>
            </div>
            <Progress
              value={analysis.relevanceScore}
              className="h-1.5"
              indicatorClassName={getProgressColor(analysis.relevanceScore)}
            />
          </div>
        </div>

        {/* Section Scores */}
        <div className="space-y-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Section Scores</h3>
          <div className="space-y-3">
            {Object.entries(analysis.sectionScores).map(([section, score]) => (
              <div key={section} className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-medium capitalize">{section}</h4>
                  <span className={`text-xs font-medium ${getScoreColor(score)}`}>{score}%</span>
                </div>
                <Progress value={score} className="h-1" indicatorClassName={getProgressColor(score)} />
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Analysis */}
        <Tabs defaultValue="strengths" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="strengths">Strengths</TabsTrigger>
            <TabsTrigger value="weaknesses">Weaknesses</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="strengths" className="mt-4 space-y-3">
            {analysis.strengths.length > 0 ? (
              analysis.strengths.map((strength, index) => (
                <Alert
                  key={index}
                  variant="default"
                  className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
                >
                  <ThumbsUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-700 dark:text-green-200">{strength}</AlertDescription>
                </Alert>
              ))
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>No specific strengths identified. Add more content to your resume.</AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="weaknesses" className="mt-4 space-y-3">
            {analysis.weaknesses.length > 0 ? (
              analysis.weaknesses.map((weakness, index) => (
                <Alert
                  key={index}
                  variant="default"
                  className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950"
                >
                  <ThumbsDown className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <AlertDescription className="text-yellow-700 dark:text-yellow-200">{weakness}</AlertDescription>
                </Alert>
              ))
            ) : (
              <Alert variant="default" className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-300">Great Job!</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-200">
                  No significant weaknesses found in your resume.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="suggestions" className="mt-4 space-y-3">
            {analysis.suggestions.length > 0 ? (
              analysis.suggestions.map((suggestion, index) => (
                <Alert
                  key={index}
                  variant="default"
                  className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950"
                >
                  <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-blue-700 dark:text-blue-200">{suggestion}</AlertDescription>
                </Alert>
              ))
            ) : (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No specific suggestions available. Your resume appears to be well-structured.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Function to analyze the resume
function analyzeResume(resumeData: ResumeData) {
  // Initialize scores
  let contentScore = 0
  let formatScore = 0
  let relevanceScore = 0
  const strengths: string[] = []
  const weaknesses: string[] = []
  const suggestions: string[] = []
  const sectionScores: Record<string, number> = {}

  // Analyze personal info
  const personalInfoScore = analyzePersonalInfo(resumeData.personalInfo)
  sectionScores.personalInfo = personalInfoScore

  // Analyze skills
  const skillsScore = analyzeSkills(resumeData.skills)
  sectionScores.skills = skillsScore

  // Analyze experience
  const experienceScore = analyzeExperience(resumeData.experience)
  sectionScores.experience = experienceScore

  // Analyze education
  const educationScore = analyzeEducation(resumeData.education)
  sectionScores.education = educationScore

  // Analyze projects
  const projectsScore = analyzeProjects(resumeData.projects)
  sectionScores.projects = projectsScore

  // Calculate overall content score
  contentScore = Math.round(
    personalInfoScore * 0.15 +
    skillsScore * 0.2 +
    experienceScore * 0.35 +
    educationScore * 0.15 +
    projectsScore * 0.15,
  )

  // Analyze format and structure
  formatScore = analyzeFormat(resumeData)

  // Analyze relevance and impact
  relevanceScore = analyzeRelevance(resumeData)

  // Calculate overall score
  const overallScore = Math.round(contentScore * 0.5 + formatScore * 0.25 + relevanceScore * 0.25)

  // Generate strengths
  if (personalInfoScore >= 80) {
    strengths.push("Strong professional summary that effectively highlights your expertise and value proposition.")
  }
  if (skillsScore >= 80) {
    strengths.push("Well-organized skills section with a good balance of technical and soft skills.")
  }
  if (experienceScore >= 80) {
    strengths.push("Strong work experience with clear achievements and impactful contributions.")
  }
  if (educationScore >= 80) {
    strengths.push("Education section effectively showcases your academic credentials and relevant coursework.")
  }
  if (projectsScore >= 80) {
    strengths.push("Impressive project portfolio that demonstrates practical application of your skills.")
  }
  if (formatScore >= 80) {
    strengths.push("Well-structured resume with good organization and readability.")
  }
  if (relevanceScore >= 80) {
    strengths.push("Your resume effectively communicates your value and impact in previous roles.")
  }

  // Generate weaknesses
  if (personalInfoScore < 70) {
    weaknesses.push("Your professional summary could be more compelling and focused on your unique value proposition.")
  }
  if (skillsScore < 70) {
    weaknesses.push("Your skills section needs more organization and could benefit from categorization.")
  }
  if (experienceScore < 70) {
    weaknesses.push("Work experience lacks quantifiable achievements and clear impact statements.")
  }
  if (educationScore < 70) {
    weaknesses.push("Education section could be enhanced with more details about relevant coursework or achievements.")
  }
  if (projectsScore < 70) {
    weaknesses.push("Project descriptions lack technical details and clear outcome statements.")
  }
  if (formatScore < 70) {
    weaknesses.push("Resume structure could be improved for better readability and flow.")
  }
  if (relevanceScore < 70) {
    weaknesses.push("Your resume doesn't effectively communicate your impact and value in previous roles.")
  }

  // Generate suggestions
  if (personalInfoScore < 90) {
    suggestions.push(
      "Enhance your professional summary by focusing on your unique value proposition and career achievements.",
    )
  }
  if (skillsScore < 90) {
    suggestions.push(
      "Organize your skills into clear categories (e.g., Technical, Soft Skills, Tools) for better readability.",
    )
  }
  if (experienceScore < 90) {
    suggestions.push(
      "Add more quantifiable achievements to your work experience (e.g., percentages, numbers, metrics).",
    )
  }
  if (educationScore < 90) {
    suggestions.push(
      "Include relevant coursework, academic achievements, or extracurricular activities in your education section.",
    )
  }
  if (projectsScore < 90) {
    suggestions.push(
      "Enhance project descriptions with technical details, your specific role, and measurable outcomes.",
    )
  }
  if (formatScore < 90) {
    suggestions.push(
      "Improve resume structure by using consistent formatting and ensuring a logical flow between sections.",
    )
  }
  if (relevanceScore < 90) {
    suggestions.push(
      "Focus on demonstrating your impact and value in each role rather than just listing responsibilities.",
    )
  }

  // Add general suggestions
  suggestions.push("Tailor your resume for each job application by matching keywords from the job description.")
  suggestions.push("Consider adding a 'Core Competencies' section to highlight your most relevant skills at a glance.")
  suggestions.push("Keep your resume concise and focused on your most relevant and recent experiences.")

  return {
    overallScore,
    contentScore,
    formatScore,
    relevanceScore,
    strengths,
    weaknesses,
    suggestions,
    sectionScores,
  }
}

// Helper functions for analysis
function analyzePersonalInfo(personalInfo: ResumeData["personalInfo"]): number {
  let score = 0

  // Check for completeness
  if (personalInfo.name) score += 10
  if (personalInfo.title) score += 10
  if (personalInfo.email) score += 10
  if (personalInfo.phone) score += 10
  if (personalInfo.location) score += 10
  if (personalInfo.website) score += 10

  // Check summary quality
  if (personalInfo.summary) {
    score += 10 // Base points for having a summary

    // Additional points for summary quality
    if (personalInfo.summary.length > 30) score += 5
    if (personalInfo.summary.length > 100) score += 5
    if (
      personalInfo.summary.includes("experience") ||
      personalInfo.summary.includes("skills") ||
      personalInfo.summary.includes("expertise")
    ) {
      score += 5
    }
    if (/\d+\+?\s*years?/.test(personalInfo.summary)) score += 5 // Mentions years of experience
  }

  return Math.min(100, score)
}

function analyzeSkills(skills: ResumeData["skills"]): number {
  let score = 0

  // Check for presence of skills
  if (skills.length > 0) score += 20

  // Check for categorization
  if (skills.length > 1) score += 20

  // Check for number of skills
  const totalSkills = skills.reduce((total, category) => total + category.skills.length, 0)
  if (totalSkills >= 5) score += 15
  if (totalSkills >= 10) score += 15
  if (totalSkills >= 15) score += 10

  // Check for diversity of skills
  const uniqueCategories = new Set(skills.map((category) => category.name)).size
  if (uniqueCategories >= 2) score += 10
  if (uniqueCategories >= 3) score += 10

  return Math.min(100, score)
}

function analyzeExperience(experience: ResumeData["experience"]): number {
  let score = 0

  // Check for presence of experience
  if (experience.length > 0) score += 20

  // Check for number of experiences
  if (experience.length >= 2) score += 10
  if (experience.length >= 3) score += 10

  // Check for completeness of each experience
  let completenessScore = 0
  let achievementsScore = 0
  let quantifiableScore = 0

  experience.forEach((exp) => {
    // Check completeness
    let expScore = 0
    if (exp.company) expScore += 1
    if (exp.position) expScore += 1
    if (exp.startDate) expScore += 1
    if (exp.endDate) expScore += 1
    if (exp.location) expScore += 1
    if (exp.description) expScore += 1

    completenessScore += (expScore / 6) * 10 // Max 10 points per experience

    // Check achievements
    if (exp.achievements.length > 0) achievementsScore += 5
    if (exp.achievements.length >= 3) achievementsScore += 5

    // Check for quantifiable achievements
    exp.achievements.forEach((achievement) => {
      if (/\d+%|\d+ times|\d+x|\$\d+|\d+ people/i.test(achievement)) {
        quantifiableScore += 5
      }
    })
  })

  // Normalize scores based on number of experiences
  if (experience.length > 0) {
    completenessScore = Math.min(20, completenessScore / experience.length)
    achievementsScore = Math.min(20, achievementsScore)
    quantifiableScore = Math.min(20, quantifiableScore)
  }

  score += completenessScore + achievementsScore + quantifiableScore

  return Math.min(100, score)
}

function analyzeEducation(education: ResumeData["education"]): number {
  let score = 0

  // Check for presence of education
  if (education.length > 0) score += 30

  // Check for completeness of each education
  let completenessScore = 0

  education.forEach((edu) => {
    let eduScore = 0
    if (edu.institution) eduScore += 1
    if (edu.degree) eduScore += 1
    if (edu.field) eduScore += 1
    if (edu.startDate) eduScore += 1
    if (edu.endDate) eduScore += 1
    if (edu.location) eduScore += 1
    if (edu.description) eduScore += 1

    completenessScore += (eduScore / 7) * 20 // Max 20 points per education
  })

  // Normalize score based on number of educations
  if (education.length > 0) {
    completenessScore = Math.min(50, completenessScore / education.length)
  }

  score += completenessScore

  // Additional points for relevant details
  education.forEach((edu) => {
    if (edu.description && edu.description.length > 20) score += 5
  })

  return Math.min(100, score)
}

function analyzeProjects(projects: ResumeData["projects"]): number {
  let score = 0

  // Check for presence of projects
  if (projects.length > 0) score += 20

  // Check for number of projects
  if (projects.length >= 2) score += 10
  if (projects.length >= 3) score += 10

  // Check for completeness of each project
  let completenessScore = 0
  let achievementsScore = 0

  projects.forEach((project) => {
    let projScore = 0
    if (project.name) projScore += 1
    if (project.description) projScore += 1
    if (project.technologies) projScore += 1
    if (project.link) projScore += 1
    if (project.startDate) projScore += 1
    if (project.endDate) projScore += 1

    completenessScore += (projScore / 6) * 10 // Max 10 points per project

    // Check achievements
    if (project.achievements.length > 0) achievementsScore += 5
    if (project.achievements.length >= 3) achievementsScore += 5
  })

  // Normalize scores based on number of projects
  if (projects.length > 0) {
    completenessScore = Math.min(30, completenessScore / projects.length)
    achievementsScore = Math.min(20, achievementsScore)
  }

  score += completenessScore + achievementsScore

  return Math.min(100, score)
}

function analyzeFormat(resumeData: ResumeData): number {
  let score = 70 // Base score

  // Check for consistent date formatting
  const dateFormats = new Set()
  resumeData.experience.forEach((exp) => {
    if (exp.startDate) dateFormats.add(getDateFormat(exp.startDate))
    if (exp.endDate) dateFormats.add(getDateFormat(exp.endDate))
  })
  resumeData.education.forEach((edu) => {
    if (edu.startDate) dateFormats.add(getDateFormat(edu.startDate))
    if (edu.endDate) dateFormats.add(getDateFormat(edu.endDate))
  })

  if (dateFormats.size <= 1) score += 10 // Consistent date formatting

  // Check for section completeness
  if (resumeData.personalInfo.name && resumeData.personalInfo.title && resumeData.personalInfo.summary) {
    score += 5
  }

  if (resumeData.skills.length > 0) score += 5
  if (resumeData.experience.length > 0) score += 5
  if (resumeData.education.length > 0) score += 5

  return Math.min(100, score)
}

function analyzeRelevance(resumeData: ResumeData): number {
  let score = 60 // Base score

  // Check for impact statements in experience
  let impactScore = 0
  resumeData.experience.forEach((exp) => {
    exp.achievements.forEach((achievement) => {
      if (/increased|improved|reduced|saved|delivered|launched|created|developed|implemented/i.test(achievement)) {
        impactScore += 5
      }
      if (/\d+%|\d+ times|\d+x|\$\d+|\d+ people/i.test(achievement)) {
        impactScore += 5
      }
    })
  })

  score += Math.min(20, impactScore)

  // Check for relevant skills
  if (resumeData.skills.length > 0) {
    score += 10
  }

  // Check for project relevance
  if (resumeData.projects.length > 0) {
    score += 10
  }

  return Math.min(100, score)
}

function getDateFormat(dateString: string): string {
  if (/^\d{4}$/.test(dateString)) return "YYYY"
  if (/^\w+ \d{4}$/.test(dateString)) return "Month YYYY"
  if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(dateString)) return "MM/DD/YYYY"
  return "Other"
}
