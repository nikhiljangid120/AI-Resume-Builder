import type { EmbeddingMatch } from "./types"

/**
 * Calculate embedding match between resume text and job description
 */
export async function calculateEmbeddingMatch(resumeText: string, jobDescription: string): Promise<EmbeddingMatch> {
  // Check if API key is configured
  if (!process.env.HUGGINGFACE_API_KEY) {
    // console.log("HuggingFace API key not configured, using basic similarity") // Optional logging
    return calculateBasicSimilarity(resumeText, jobDescription)
  }

  try {
    // Try to use HuggingFace API for embeddings
    return await calculateWithHuggingFace(resumeText, jobDescription)
  } catch (error) {
    console.error("Error using HuggingFace API:", error)

    // Fallback to basic keyword-based similarity
    return calculateBasicSimilarity(resumeText, jobDescription)
  }
}

/**
 * Calculate embedding match using HuggingFace API
 */
async function calculateWithHuggingFace(resumeText: string, jobDescription: string): Promise<EmbeddingMatch> {
  try {
    // Split resume into sections
    const sections = splitIntoSections(resumeText)
    const sectionTexts = sections.map((s) => s.text)

    // Call HuggingFace API to get embeddings
    const response = await fetch("https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY || ""}`,
      },
      body: JSON.stringify({
        inputs: {
          source_sentence: jobDescription,
          sentences: sectionTexts,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.status}`)
    }

    const similarities = await response.json()

    // Find sections with highest similarity
    const sectionScores = similarities.map((score: number, index: number) => ({
      section: sections[index].name,
      score,
    }))

    // Sort by score descending
    sectionScores.sort((a: any, b: any) => b.score - a.score)

    // Get overall score (average of top 3 sections)
    const topScores = sectionScores.slice(0, 3)
    const overallScore = topScores.reduce((sum: number, item: any) => sum + item.score, 0) / topScores.length

    return {
      score: overallScore,
      relevantSections: topScores.map((item: any) => item.section),
    }
  } catch (error) {
    console.error("Error using HuggingFace API:", error)
    throw error
  }
}

/**
 * Split resume text into named sections
 */
function splitIntoSections(text: string): { name: string; text: string }[] {
  const sections: { name: string; text: string }[] = []

  // Common section headers in resumes
  const sectionPatterns = [
    { name: "Summary", pattern: /\b(SUMMARY|PROFILE|OBJECTIVE|ABOUT)\b/i },
    { name: "Experience", pattern: /\b(EXPERIENCE|WORK|EMPLOYMENT|HISTORY)\b/i },
    { name: "Education", pattern: /\b(EDUCATION|ACADEMIC|QUALIFICATION|DEGREE)\b/i },
    { name: "Skills", pattern: /\b(SKILLS|EXPERTISE|COMPETENCIES|ABILITIES)\b/i },
    { name: "Projects", pattern: /\b(PROJECTS|PORTFOLIO)\b/i },
    { name: "Certifications", pattern: /\b(CERTIFICATIONS|CERTIFICATES|LICENSES)\b/i },
  ]

  // Split text by potential section headers
  const lines = text.split("\n")
  let currentSection = { name: "Header", text: "" }

  for (const line of lines) {
    // Check if this line is a section header
    let isSectionHeader = false
    for (const { name, pattern } of sectionPatterns) {
      if (pattern.test(line)) {
        // Save previous section
        if (currentSection.text.trim()) {
          sections.push({ ...currentSection })
        }
        // Start new section
        currentSection = { name, text: line + "\n" }
        isSectionHeader = true
        break
      }
    }

    if (!isSectionHeader) {
      // Add line to current section
      currentSection.text += line + "\n"
    }
  }

  // Add the last section
  if (currentSection.text.trim()) {
    sections.push(currentSection)
  }

  // If no sections were found, treat the whole text as one section
  if (sections.length === 0) {
    sections.push({ name: "Full Resume", text })
  }

  return sections
}

/**
 * Calculate basic similarity as fallback
 */
function calculateBasicSimilarity(resumeText: string, jobDescription: string): EmbeddingMatch {
  // Convert to lowercase and tokenize
  const resumeWords = new Set(resumeText.toLowerCase().split(/\W+/).filter(Boolean))
  const jobWords = jobDescription.toLowerCase().split(/\W+/).filter(Boolean)

  // Count matching words
  let matches = 0
  for (const word of jobWords) {
    if (resumeWords.has(word)) {
      matches++
    }
  }

  // Calculate similarity score
  const score = matches / Math.max(1, jobWords.length)

  return {
    score,
    relevantSections: ["Full Resume"],
  }
}
