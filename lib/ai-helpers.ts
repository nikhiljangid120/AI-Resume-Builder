import type { ResumeData } from "./types"
import {
  generateProfessionalSummary,
  enhanceBulletPoints,
  analyzeResumeForATS,
  generateTailoringTips,
} from "./gemini-api"

// Generate AI summary using Gemini API
export async function generateAISummary(resumeData: ResumeData, jobDescription: string): Promise<string> {
  try {
    return await generateProfessionalSummary(resumeData, jobDescription)
  } catch (error) {
    console.error("Error generating AI summary:", error)

    // Fallback to a generic summary if API fails
    const skills = resumeData.skills.flatMap((category) => category.skills.map((skill) => skill.name)).join(", ")
    const experience = resumeData.experience.length > 0 ? resumeData.experience[0].position : "Full-Stack Developer"

    return `Passionate ${experience} with expertise in ${skills}. Committed to delivering high-quality, scalable solutions and continuously expanding technical knowledge. Proven ability to collaborate effectively in team environments and adapt quickly to new technologies and methodologies.`
  }
}

// Enhance resume content using Gemini API
export async function enhanceResumeContent(
  resumeData: ResumeData,
  jobDescription: string,
): Promise<Partial<ResumeData>> {
  try {
    // Create a deep copy to avoid mutating the original
    const enhancedData: Partial<ResumeData> = JSON.parse(JSON.stringify(resumeData))

    // Enhance experience achievements with AI
    if (enhancedData.experience && enhancedData.experience.length > 0) {
      for (let i = 0; i < enhancedData.experience.length; i++) {
        const exp = enhancedData.experience[i]
        if (exp.achievements.length > 0) {
          const context = `${resumeData.personalInfo.title} with experience as ${exp.position} at ${exp.company}`
          try {
            const enhancedAchievements = await enhanceBulletPoints(exp.achievements, context)
            // Only update if we got valid results back
            if (enhancedAchievements && enhancedAchievements.length > 0) {
              exp.achievements = enhancedAchievements
            }
          } catch (error) {
            console.error(`Error enhancing achievements for experience ${i}:`, error)
            // Keep original achievements if enhancement fails
          }
        }
      }
    }

    // Enhance project achievements with AI
    if (enhancedData.projects && enhancedData.projects.length > 0) {
      for (let i = 0; i < enhancedData.projects.length; i++) {
        const project = enhancedData.projects[i]
        if (project.achievements.length > 0) {
          const context = `${resumeData.personalInfo.title} working on ${project.name} using ${project.technologies}`
          try {
            const enhancedAchievements = await enhanceBulletPoints(project.achievements, context)
            // Only update if we got valid results back
            if (enhancedAchievements && enhancedAchievements.length > 0) {
              project.achievements = enhancedAchievements
            }
          } catch (error) {
            console.error(`Error enhancing achievements for project ${i}:`, error)
            // Keep original achievements if enhancement fails
          }
        }
      }
    }

    return enhancedData
  } catch (error) {
    console.error("Error enhancing resume content:", error)
    return resumeData // Return original data if enhancement fails
  }
}

// Analyze resume for ATS compatibility using Gemini API
export async function analyzeResume(
  resumeData: ResumeData,
  jobDescription: string,
): Promise<{
  score: number
  feedback: string[]
  missingKeywords: string[]
  tailoringTips: string[]
}> {
  try {
    const [atsAnalysis, tailoringTips] = await Promise.all([
      analyzeResumeForATS(resumeData, jobDescription),
      generateTailoringTips(resumeData, jobDescription),
    ])

    return {
      ...atsAnalysis,
      tailoringTips,
    }
  } catch (error) {
    console.error("Error analyzing resume:", error)
    return {
      score: 70,
      feedback: [
        "Make sure your resume includes relevant keywords from the job description.",
        "Quantify your achievements with specific metrics where possible.",
        "Ensure your resume is properly formatted for ATS systems.",
      ],
      missingKeywords: [],
      tailoringTips: [],
    }
  }
}
