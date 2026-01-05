"use client"

import type { ResumeData } from "@/lib/types"
import type { ResumeScoreResult, ScoringOptions } from "./types"
import { generateStructuredData, analyzeTextSimilarity } from "../ai-services/groq-service"

/**
 * Score a resume against a job description
 */
export async function scoreResume(
  resumeData: ResumeData,
  jobDescription: string,
  options: ScoringOptions = { useEmbeddings: true, checkGrammar: true, includeContextForKeywords: true },
): Promise<ResumeScoreResult> {
  try {
    // Convert resume data to text for analysis
    const resumeText = convertResumeDataToText(resumeData)

    // Extract keywords from job description
    const keywords = await extractKeywords(jobDescription)

    // Calculate keyword match score
    const keywordMatchScore = await calculateKeywordMatchScore(resumeText, keywords, options.includeContextForKeywords)

    // Calculate content relevance score using embeddings if enabled
    let contentRelevanceScore = 70 // Default score
    if (options.useEmbeddings) {
      contentRelevanceScore = await analyzeTextSimilarity(resumeText, jobDescription)
    }

    // Calculate format score
    const formatScore = calculateFormatScore(resumeData)

    // Calculate grammar score if enabled
    let grammarScore: number | undefined
    if (options.checkGrammar) {
      grammarScore = await checkGrammar(resumeText)
    }

    // Get missing keywords
    const missingKeywords = await findMissingKeywords(resumeText, keywords)

    // Generate improvement suggestions
    const suggestions = await generateSuggestions(resumeText, jobDescription, missingKeywords)

    // Calculate overall score
    const scores = [keywordMatchScore, contentRelevanceScore, formatScore]
    if (grammarScore !== undefined) scores.push(grammarScore)
    const overallScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)

    return {
      overallScore,
      keywordMatchScore,
      contentRelevanceScore,
      formatScore,
      grammarScore,
      missingKeywords,
      suggestions,
    }
  } catch (error) {
    console.error("Error scoring resume:", error)
    throw new Error("Failed to score resume. Please try again.")
  }
}

/**
 * Convert resume data to text for analysis
 */
function convertResumeDataToText(resumeData: ResumeData): string {
  const sections = []

  // Personal info
  sections.push(`${resumeData.personalInfo.name || ""}`)
  sections.push(`${resumeData.personalInfo.title || ""}`)
  sections.push(`${resumeData.personalInfo.email || ""}`)
  sections.push(`${resumeData.personalInfo.phone || ""}`)
  sections.push(`${resumeData.personalInfo.location || ""}`)
  sections.push(`${resumeData.personalInfo.summary || ""}`)

  // Skills
  const skillsText = resumeData.skills
    .map((skillCategory) => {
      return `${skillCategory.name}: ${skillCategory.skills.map((s) => s.name).join(", ")}`
    })
    .join("\n")
  sections.push(skillsText)

  // Experience
  const experienceText = resumeData.experience
    .map((exp) => {
      const achievements = exp.achievements.join("\n- ")
      return `${exp.position} at ${exp.company}, ${exp.startDate} - ${exp.endDate}\n${exp.description}\n- ${achievements}`
    })
    .join("\n\n")
  sections.push(experienceText)

  // Education
  const educationText = resumeData.education
    .map((edu) => {
      return `${edu.degree} in ${edu.field}, ${edu.institution}, ${edu.startDate} - ${edu.endDate}\n${edu.description}`
    })
    .join("\n\n")
  sections.push(educationText)

  // Projects
  const projectsText = resumeData.projects
    .map((proj) => {
      const achievements = proj.achievements.join("\n- ")
      return `${proj.name}\n${proj.description}\nTechnologies: ${proj.technologies}\n- ${achievements}`
    })
    .join("\n\n")
  sections.push(projectsText)

  return sections.filter(Boolean).join("\n\n")
}

/**
 * Extract keywords from job description
 */
async function extractKeywords(jobDescription: string): Promise<string[]> {
  try {
    const prompt = `
    Extract the most important keywords from this job description. Focus on:
    1. Technical skills and tools
    2. Soft skills and qualities
    3. Industry-specific terminology
    4. Required qualifications and certifications
    
    Job Description:
    ${jobDescription}
    
    Return ONLY an array of keywords (15-25 keywords) in JSON format.
    `

    const response = await generateStructuredData<{ keywords: string[] }>(prompt, undefined, { temperature: 0.2 })
    return response.keywords || []
  } catch (error) {
    console.error("Error extracting keywords:", error)
    return []
  }
}

/**
 * Calculate keyword match score
 */
async function calculateKeywordMatchScore(
  resumeText: string,
  keywords: string[],
  includeContext: boolean,
): Promise<number> {
  if (!keywords.length) return 70 // Default score if no keywords

  try {
    if (includeContext) {
      const prompt = `
      Analyze how well this resume matches the following keywords. Consider synonyms and related terms.
      
      Resume:
      ${resumeText}
      
      Keywords to check:
      ${keywords.join(", ")}
      
      Return ONLY a number between 0 and 100 representing the percentage of keywords effectively covered in the resume.
      `

      const response = await generateStructuredData<{ score: number }>(prompt, undefined, { temperature: 0.1 })
      return response.score
    } else {
      // Simple keyword matching
      let matchCount = 0
      const resumeTextLower = resumeText.toLowerCase()

      for (const keyword of keywords) {
        if (resumeTextLower.includes(keyword.toLowerCase())) {
          matchCount++
        }
      }

      return Math.round((matchCount / keywords.length) * 100)
    }
  } catch (error) {
    console.error("Error calculating keyword match score:", error)
    return 70 // Default score on error
  }
}

/**
 * Calculate format score based on resume structure
 */
function calculateFormatScore(resumeData: ResumeData): number {
  let score = 0

  // Check personal info completeness
  const personalInfoFields = [
    resumeData.personalInfo.name,
    resumeData.personalInfo.email,
    resumeData.personalInfo.phone,
    resumeData.personalInfo.location,
    resumeData.personalInfo.summary,
  ]
  const personalInfoScore = (personalInfoFields.filter(Boolean).length / personalInfoFields.length) * 25
  score += personalInfoScore

  // Check skills
  const hasSkills = resumeData.skills.length > 0 && resumeData.skills.some((category) => category.skills.length > 0)
  score += hasSkills ? 25 : 0

  // Check experience
  const hasDetailedExperience =
    resumeData.experience.length > 0 && resumeData.experience.some((exp) => exp.achievements.length > 0)
  score += hasDetailedExperience ? 25 : 0

  // Check education
  const hasEducation = resumeData.education.length > 0
  score += hasEducation ? 25 : 0

  return Math.round(score)
}

/**
 * Check grammar and clarity
 */
async function checkGrammar(text: string): Promise<number> {
  try {
    const prompt = `
    Evaluate the grammar, clarity, and professional tone of this resume text. 
    Consider:
    1. Grammar and spelling
    2. Clarity and conciseness
    3. Professional language
    4. Consistent tense and formatting
    
    Resume text:
    ${text}
    
    Return ONLY a score between 0 and 100.
    `

    const response = await generateStructuredData<{ score: number }>(prompt, undefined, { temperature: 0.1 })
    return response.score
  } catch (error) {
    console.error("Error checking grammar:", error)
    return 80 // Default score on error
  }
}

/**
 * Find missing keywords in resume
 */
async function findMissingKeywords(resumeText: string, keywords: string[]): Promise<string[]> {
  try {
    const prompt = `
    Identify which of these important keywords are missing from the resume text.
    Consider synonyms and related terms - only mark a keyword as missing if there's no equivalent term or concept in the resume.
    
    Resume:
    ${resumeText}
    
    Keywords to check:
    ${keywords.join(", ")}
    
    Return ONLY an array of missing keywords in JSON format.
    `

    const response = await generateStructuredData<{ missingKeywords: string[] }>(prompt, undefined, {
      temperature: 0.1,
    })
    return response.missingKeywords || []
  } catch (error) {
    console.error("Error finding missing keywords:", error)
    return []
  }
}

/**
 * Generate improvement suggestions
 */
async function generateSuggestions(
  resumeText: string,
  jobDescription: string,
  missingKeywords: string[],
): Promise<string[]> {
  try {
    const prompt = `
    Generate specific, actionable suggestions to improve this resume for the job description.
    Focus on:
    1. Adding missing keywords: ${missingKeywords.join(", ")}
    2. Improving structure and formatting
    3. Enhancing content relevance
    4. Strengthening achievement statements
    
    Resume:
    ${resumeText}
    
    Job Description:
    ${jobDescription}
    
    Return 3-5 specific suggestions as an array of strings in JSON format.
    `

    const response = await generateStructuredData<{ suggestions: string[] }>(prompt, undefined, { temperature: 0.7 })
    return response.suggestions || []
  } catch (error) {
    console.error("Error generating suggestions:", error)
    return [
      "Add missing keywords to increase ATS compatibility",
      "Quantify achievements with specific metrics and results",
      "Tailor your summary to match the job requirements more closely",
    ]
  }
}
