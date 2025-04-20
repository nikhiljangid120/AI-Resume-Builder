import type { ResumeData } from "./types"

interface AnalysisResult {
  score: number
  feedback: string[]
  missingKeywords: string[]
  keywordMatches: { keyword: string; found: boolean }[]
  improvementTips: string[]
}

export async function analyzeResume(resumeData: ResumeData, jobDescription: string): Promise<AnalysisResult> {
  // If no job description, return a basic analysis
  if (!jobDescription) {
    return {
      score: 70,
      feedback: ["Add a job description for a more accurate analysis."],
      missingKeywords: [],
      keywordMatches: [],
      improvementTips: [
        "Add a detailed job description to get personalized recommendations.",
        "Ensure your resume includes quantifiable achievements.",
        "Use industry-specific keywords in your resume.",
      ],
    }
  }

  try {
    // Extract text representation of resume
    const resumeText = generateResumeText(resumeData)

    // Extract keywords from job description
    const keywords = extractKeywords(jobDescription)

    // Check which keywords are present in the resume
    const keywordMatches = keywords.map((keyword) => ({
      keyword,
      found: resumeText.toLowerCase().includes(keyword.toLowerCase()),
    }))

    // Calculate score based on keyword matches
    const matchedKeywords = keywordMatches.filter((k) => k.found).length
    const keywordScore = Math.round((matchedKeywords / Math.max(1, keywords.length)) * 100)

    // Get missing keywords
    const missingKeywords = keywordMatches.filter((k) => !k.found).map((k) => k.keyword)

    // Generate feedback based on analysis
    const feedback = generateFeedback(resumeData, keywordScore, missingKeywords)

    // Generate improvement tips
    const improvementTips = generateImprovementTips(resumeData, jobDescription, missingKeywords)

    return {
      score: keywordScore,
      feedback,
      missingKeywords,
      keywordMatches,
      improvementTips,
    }
  } catch (error) {
    console.error("Error analyzing resume:", error)
    return {
      score: 60,
      feedback: ["An error occurred during analysis. Please try again."],
      missingKeywords: [],
      keywordMatches: [],
      improvementTips: ["Ensure all sections of your resume are properly filled out."],
    }
  }
}

function generateResumeText(resumeData: ResumeData): string {
  const { personalInfo, skills, experience, education, projects } = resumeData

  let text = ""

  // Personal Info
  text += `${personalInfo.name}\n${personalInfo.title}\n${personalInfo.summary}\n`

  // Skills
  skills.forEach((category) => {
    text += `${category.name}: ${category.skills.map((skill) => skill.name).join(", ")}\n`
  })

  // Experience
  experience.forEach((exp) => {
    text += `${exp.position} at ${exp.company}\n${exp.description}\n`
    exp.achievements.forEach((achievement) => {
      text += `- ${achievement}\n`
    })
  })

  // Education
  education.forEach((edu) => {
    text += `${edu.degree} in ${edu.field} from ${edu.institution}\n${edu.description}\n`
  })

  // Projects
  projects.forEach((project) => {
    text += `${project.name}\n${project.description}\n${project.technologies}\n`
    project.achievements.forEach((achievement) => {
      text += `- ${achievement}\n`
    })
  })

  return text
}

function extractKeywords(jobDescription: string): string[] {
  // Remove common words and extract potential keywords
  const commonWords = new Set([
    "and",
    "the",
    "a",
    "an",
    "in",
    "on",
    "at",
    "to",
    "for",
    "with",
    "by",
    "of",
    "or",
    "is",
    "are",
    "be",
    "will",
    "have",
    "has",
  ])

  // Split by non-word characters and filter
  const words = jobDescription
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 3 && !commonWords.has(word))

  // Count word frequency
  const wordCount = new Map<string, number>()
  words.forEach((word) => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1)
  })

  // Extract phrases (2-3 word combinations)
  const phrases: string[] = []
  const jobWords = jobDescription.toLowerCase().split(/\W+/).filter(Boolean)

  for (let i = 0; i < jobWords.length - 1; i++) {
    if (jobWords[i].length > 3 && jobWords[i + 1].length > 3) {
      phrases.push(`${jobWords[i]} ${jobWords[i + 1]}`)
    }
    if (i < jobWords.length - 2 && jobWords[i].length > 3 && jobWords[i + 2].length > 3) {
      phrases.push(`${jobWords[i]} ${jobWords[i + 1]} ${jobWords[i + 2]}`)
    }
  }

  // Get top keywords by frequency
  const sortedWords = [...wordCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word)

  // Add important phrases from job description
  const importantPhrases = [
    "years of experience",
    "required skills",
    "preferred qualifications",
    "bachelor's degree",
    "master's degree",
    "team player",
    "problem solving",
    "communication skills",
  ]

  const foundPhrases = importantPhrases.filter((phrase) => jobDescription.toLowerCase().includes(phrase.toLowerCase()))

  // Combine words and phrases, remove duplicates
  return [...new Set([...sortedWords, ...foundPhrases])]
}

function generateFeedback(resumeData: ResumeData, keywordScore: number, missingKeywords: string[]): string[] {
  const feedback: string[] = []

  // Keyword match feedback
  if (keywordScore < 50) {
    feedback.push(
      `Your resume matches only ${keywordScore}% of key terms from the job description. Consider adding more relevant keywords.`,
    )
  } else if (keywordScore < 70) {
    feedback.push(
      `Your resume matches ${keywordScore}% of key terms from the job description. Good, but there's room for improvement.`,
    )
  } else {
    feedback.push(`Great job! Your resume matches ${keywordScore}% of key terms from the job description.`)
  }

  // Missing keywords feedback
  if (missingKeywords.length > 0) {
    feedback.push(
      `Consider adding these missing keywords: ${missingKeywords.slice(0, 5).join(", ")}${missingKeywords.length > 5 ? "..." : ""}`,
    )
  }

  // Summary feedback
  if (!resumeData.personalInfo.summary || resumeData.personalInfo.summary.length < 50) {
    feedback.push(
      "Your professional summary is too short or missing. A strong summary helps recruiters quickly understand your value proposition.",
    )
  }

  // Experience feedback
  const hasQuantifiableAchievements = resumeData.experience.some((exp) =>
    exp.achievements.some((achievement) => /\d+%|\d+ times|\d+x|\$\d+|\d+ people/i.test(achievement)),
  )

  if (!hasQuantifiableAchievements) {
    feedback.push(
      "Add quantifiable achievements to your experience section (e.g., 'Improved performance by 30%' instead of 'Improved performance').",
    )
  }

  return feedback
}

function generateImprovementTips(resumeData: ResumeData, jobDescription: string, missingKeywords: string[]): string[] {
  const tips: string[] = []

  // Keyword-based tips
  if (missingKeywords.length > 0) {
    tips.push(
      `Add these missing keywords to your resume: ${missingKeywords.slice(0, 5).join(", ")}${missingKeywords.length > 5 ? "..." : ""}`,
    )
  }

  // Experience-based tips
  const experienceCount = resumeData.experience.length
  if (experienceCount === 0) {
    tips.push("Add work experience to your resume, even if it's internships or volunteer work.")
  } else if (experienceCount < 2) {
    tips.push("Consider adding more work experiences to demonstrate career progression.")
  }

  // Skills-based tips
  const skillCount = resumeData.skills.reduce((count, category) => count + category.skills.length, 0)
  if (skillCount < 5) {
    tips.push("Add more skills to your resume, especially those mentioned in the job description.")
  }

  // Education-based tips
  if (resumeData.education.length === 0) {
    tips.push("Add your educational background to strengthen your resume.")
  }

  // Project-based tips
  if (resumeData.projects.length === 0) {
    tips.push("Consider adding relevant projects to showcase your practical skills.")
  }

  // General tips
  tips.push("Use strong action verbs at the beginning of your bullet points.")
  tips.push("Ensure your resume is properly formatted for ATS systems.")
  tips.push("Tailor your resume for each job application by matching keywords from the job description.")

  return tips
}
