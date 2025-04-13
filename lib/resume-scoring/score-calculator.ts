import type { ResumeData } from "@/lib/types"
import type { ResumeScoreResult, KeywordMatch, GrammarIssue, ScoringOptions } from "./types"
import { extractKeywords } from "./keyword-extractor"
import { checkGrammar } from "./grammar-checker"
import { calculateEmbeddingMatch } from "./embedding-matcher"

const DEFAULT_OPTIONS: ScoringOptions = {
  useEmbeddings: true,
  checkGrammar: true,
  includeContextForKeywords: true,
}

/**
 * Calculate a comprehensive resume score based on multiple factors
 */
export async function resumeScore(
  resumeText: string,
  jobDescription: string,
  resumeData?: ResumeData,
  options: ScoringOptions = DEFAULT_OPTIONS,
): Promise<ResumeScoreResult> {
  // Extract keywords from job description
  const { keywords, importantKeywords } = extractKeywords(jobDescription)

  // Calculate keyword matches
  const keywordMatches = calculateKeywordMatches(
    resumeText,
    keywords,
    importantKeywords,
    options.includeContextForKeywords,
  )
  const keywordMatchScore = calculateKeywordMatchScore(keywordMatches)

  // Calculate missing keywords
  const missingKeywords = keywordMatches
    .filter((match) => !match.found && match.importance > 0.5)
    .map((match) => match.keyword)

  // Calculate embedding match score if enabled
  let embeddingMatchScore = 0
  let relevantSections: string[] = []

  if (options.useEmbeddings) {
    try {
      const embeddingResult = await calculateEmbeddingMatch(resumeText, jobDescription)
      embeddingMatchScore = Math.round(embeddingResult.score * 100)
      relevantSections = embeddingResult.relevantSections
    } catch (error) {
      console.error("Error calculating embedding match:", error)
      embeddingMatchScore = 0
    }
  }

  // Check grammar if enabled
  let grammarScore = 100
  let grammarIssues: GrammarIssue[] = []

  if (options.checkGrammar) {
    try {
      const grammarResult = await checkGrammar(resumeText)
      grammarIssues = grammarResult.issues
      grammarScore = grammarResult.score
    } catch (error) {
      console.error("Error checking grammar:", error)
      grammarScore = 80 // Default to a reasonable score if check fails
    }
  }

  // Calculate section scores if resume data is provided
  const sectionScores = resumeData ? calculateSectionScores(resumeData, jobDescription) : {}

  // Generate improvement suggestions
  const improvementSuggestions = generateImprovementSuggestions(
    keywordMatches,
    missingKeywords,
    embeddingMatchScore,
    grammarIssues,
    sectionScores,
  )

  // Calculate overall score (weighted average)
  const overallScore = Math.round(keywordMatchScore * 0.5 + embeddingMatchScore * 0.3 + grammarScore * 0.2)

  return {
    overallScore,
    keywordMatchScore,
    embeddingMatchScore,
    grammarScore,
    keywordMatches,
    missingKeywords,
    grammarIssues,
    improvementSuggestions,
    sectionScores,
  }
}

/**
 * Calculate keyword matches between resume text and job keywords
 */
function calculateKeywordMatches(
  resumeText: string,
  keywords: string[],
  importantKeywords: string[],
  includeContext = true,
): KeywordMatch[] {
  const lowerResumeText = resumeText.toLowerCase()
  const matches: KeywordMatch[] = []

  // Process each keyword
  for (const keyword of keywords) {
    const lowerKeyword = keyword.toLowerCase()
    const found = lowerResumeText.includes(lowerKeyword)
    const importance = importantKeywords.includes(keyword) ? 1 : 0.5

    let context: string | undefined

    if (found && includeContext) {
      // Extract surrounding context (50 chars before and after)
      const keywordIndex = lowerResumeText.indexOf(lowerKeyword)
      const startIndex = Math.max(0, keywordIndex - 50)
      const endIndex = Math.min(lowerResumeText.length, keywordIndex + lowerKeyword.length + 50)
      context = resumeText.substring(startIndex, endIndex)
    }

    matches.push({
      keyword,
      found,
      importance,
      context,
    })
  }

  return matches
}

/**
 * Calculate keyword match score based on matches
 */
function calculateKeywordMatchScore(matches: KeywordMatch[]): number {
  if (matches.length === 0) return 0

  // Calculate weighted score based on keyword importance
  let totalWeight = 0
  let weightedMatches = 0

  for (const match of matches) {
    totalWeight += match.importance
    if (match.found) {
      weightedMatches += match.importance
    }
  }

  return Math.round((weightedMatches / totalWeight) * 100)
}

/**
 * Calculate scores for different resume sections
 */
function calculateSectionScores(resumeData: ResumeData, jobDescription: string): Record<string, number> {
  const scores: Record<string, number> = {}

  // Score personal info section (mainly summary)
  if (resumeData.personalInfo.summary) {
    scores.summary = calculateSectionRelevance(resumeData.personalInfo.summary, jobDescription)
  }

  // Score skills section
  if (resumeData.skills.length > 0) {
    const skillsText = resumeData.skills.flatMap((category) => category.skills.map((skill) => skill.name)).join(" ")
    scores.skills = calculateSectionRelevance(skillsText, jobDescription)
  }

  // Score experience section
  if (resumeData.experience.length > 0) {
    const experienceText = resumeData.experience
      .map((exp) => `${exp.position} ${exp.company} ${exp.description} ${exp.achievements.join(" ")}`)
      .join(" ")
    scores.experience = calculateSectionRelevance(experienceText, jobDescription)
  }

  // Score education section
  if (resumeData.education.length > 0) {
    const educationText = resumeData.education
      .map((edu) => `${edu.degree} ${edu.field} ${edu.institution} ${edu.description}`)
      .join(" ")
    scores.education = calculateSectionRelevance(educationText, jobDescription)
  }

  // Score projects section
  if (resumeData.projects.length > 0) {
    const projectsText = resumeData.projects
      .map((proj) => `${proj.name} ${proj.description} ${proj.technologies} ${proj.achievements.join(" ")}`)
      .join(" ")
    scores.projects = calculateSectionRelevance(projectsText, jobDescription)
  }

  return scores
}

/**
 * Calculate relevance score between a section and job description
 */
function calculateSectionRelevance(sectionText: string, jobDescription: string): number {
  // Simple TF-IDF based relevance score
  const jobWords = new Set(jobDescription.toLowerCase().split(/\W+/).filter(Boolean))
  const sectionWords = sectionText.toLowerCase().split(/\W+/).filter(Boolean)

  let matches = 0
  for (const word of sectionWords) {
    if (jobWords.has(word)) {
      matches++
    }
  }

  return Math.min(100, Math.round((matches / Math.max(1, sectionWords.length)) * 100))
}

/**
 * Generate improvement suggestions based on analysis
 */
function generateImprovementSuggestions(
  keywordMatches: KeywordMatch[],
  missingKeywords: string[],
  embeddingMatchScore: number,
  grammarIssues: GrammarIssue[],
  sectionScores: Record<string, number>,
): string[] {
  const suggestions: string[] = []

  // Keyword-based suggestions
  if (missingKeywords.length > 0) {
    suggestions.push(
      `Add these missing keywords to your resume: ${missingKeywords.slice(0, 5).join(", ")}${missingKeywords.length > 5 ? "..." : ""}`,
    )
  }

  // Embedding-based suggestions
  if (embeddingMatchScore < 70) {
    suggestions.push(
      "Your resume's overall content doesn't strongly align with the job description. Consider tailoring your experience and skills more specifically to the role.",
    )
  }

  // Grammar-based suggestions
  if (grammarIssues.length > 0) {
    if (grammarIssues.length > 5) {
      suggestions.push(
        `Fix the ${grammarIssues.length} grammar and spelling issues in your resume to improve readability.`,
      )
    } else {
      suggestions.push("Proofread your resume to fix grammar and spelling issues.")
    }
  }

  // Section-specific suggestions
  for (const [section, score] of Object.entries(sectionScores)) {
    if (score < 60) {
      switch (section) {
        case "summary":
          suggestions.push("Improve your professional summary to better align with the job requirements.")
          break
        case "skills":
          suggestions.push("Update your skills section to include more relevant technologies and competencies.")
          break
        case "experience":
          suggestions.push("Tailor your work experience descriptions to highlight achievements relevant to this role.")
          break
        case "education":
          suggestions.push("Consider highlighting relevant coursework or projects in your education section.")
          break
        case "projects":
          suggestions.push("Add projects that demonstrate skills mentioned in the job description.")
          break
      }
    }
  }

  // General suggestions if we don't have many specific ones
  if (suggestions.length < 3) {
    suggestions.push("Quantify your achievements with specific metrics and numbers.")
    suggestions.push("Use strong action verbs at the beginning of your bullet points.")
    suggestions.push("Ensure your resume is properly formatted for ATS systems.")
  }

  return suggestions
}
