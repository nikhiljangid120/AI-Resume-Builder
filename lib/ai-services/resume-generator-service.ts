/**
 * Resume Generator Service
 *
 * This service uses the Gemini API to generate resume content based on user inputs.
 * It provides functions for generating different parts of a resume, including:
 * - Professional summary
 * - Work experience
 * - Skills
 * - Projects
 */

import { callGeminiAPIWithFallback } from "@/lib/gemini-api"
import type { ResumeData, Experience, Project, SkillCategory } from "@/lib/types"

/**
 * Generate a complete resume based on user inputs
 */
export async function generateCompleteResume(
  jobDescription: string,
  careerProfile = "",
  skillKeywords = "",
  experienceLevel = "mid",
  industryFocus = "tech",
  generationFocus = "ats",
): Promise<Partial<ResumeData>> {
  try {
    // Create a structured prompt for the AI
    const prompt = `
    You are an expert resume writer with years of experience creating professional, ATS-optimized resumes.
    Generate a complete resume based on the following information:

    ${jobDescription ? `JOB DESCRIPTION: ${jobDescription}` : ""}
    ${careerProfile ? `CAREER PROFILE: ${careerProfile}` : ""}
    ${skillKeywords ? `KEY SKILLS: ${skillKeywords}` : ""}
    EXPERIENCE LEVEL: ${experienceLevel} (entry/mid/senior/executive)
    INDUSTRY FOCUS: ${industryFocus}
    GENERATION FOCUS: ${generationFocus} (ats/creative/comprehensive/industry)

    Create a complete resume with the following sections:
    1. Professional Summary (concise, impactful, highlighting key qualifications)
    2. Skills (organized by categories like Technical Skills, Soft Skills, etc.)
    3. Work Experience (2-3 positions with company, title, dates, and 3-4 achievement-focused bullet points each)
    4. Projects (1-2 projects with name, description, technologies, and key achievements)

    Format your response as a JSON object with the following structure:
    {
      "personalInfo": {
        "summary": "..."
      },
      "skills": [
        {
          "name": "Category Name",
          "skills": [{"name": "Skill 1"}, {"name": "Skill 2"}]
        }
      ],
      "experience": [
        {
          "company": "...",
          "position": "...",
          "startDate": "...",
          "endDate": "...",
          "location": "...",
          "description": "...",
          "achievements": ["...", "..."]
        }
      ],
      "projects": [
        {
          "name": "...",
          "description": "...",
          "technologies": "...",
          "link": "",
          "startDate": "...",
          "endDate": "...",
          "achievements": ["...", "..."]
        }
      ]
    }

    Make the resume highly relevant to the job description or career profile provided.
    Use strong action verbs and include metrics/quantifiable achievements.
    Ensure all content is realistic, professional, and optimized for ATS systems.
    `

    // Call the Gemini API
    const response = await callGeminiAPIWithFallback(prompt, 2048)

    // Parse the JSON response
    try {
      // Extract JSON from the response (in case there's any text before or after)
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response")
      }

      const jsonStr = jsonMatch[0]
      const resumeData = JSON.parse(jsonStr)

      return resumeData
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError)
      throw new Error("Failed to parse AI-generated resume data")
    }
  } catch (error) {
    console.error("Error generating resume:", error)
    throw error
  }
}

/**
 * Generate just a professional summary
 */
export async function generateProfessionalSummary(
  jobDescription: string,
  currentTitle = "",
  experienceLevel = "mid",
): Promise<string> {
  try {
    const prompt = `
    You are an expert resume writer. Generate a compelling professional summary for a ${experienceLevel}-level ${currentTitle || "professional"} 
    based on this job description:

    ${jobDescription}

    The summary should:
    - Be 3-4 sentences long
    - Highlight relevant skills and experience
    - Include industry-specific keywords
    - Be written in first person
    - Be optimized for ATS systems

    Return ONLY the professional summary text without any additional text, markdown formatting, or code block indicators.
    `

    const response = await callGeminiAPIWithFallback(prompt, 512)
    return response.replace(/^```.*\n|```$/g, "").trim()
  } catch (error) {
    console.error("Error generating professional summary:", error)
    throw error
  }
}

/**
 * Generate work experience entries
 */
export async function generateWorkExperience(
  jobDescription: string,
  currentTitle = "",
  experienceLevel = "mid",
  count = 2,
): Promise<Experience[]> {
  try {
    const prompt = `
    You are an expert resume writer. Generate ${count} work experience entries for a ${experienceLevel}-level ${currentTitle || "professional"} 
    based on this job description:

    ${jobDescription}

    Each experience entry should include:
    - Company name (realistic but fictional)
    - Position title
    - Start and end dates (realistic for the experience level)
    - Location (city, state or remote)
    - Brief description
    - 3-4 achievement-focused bullet points with metrics

    Format your response as a JSON array with the following structure:
    [
      {
        "company": "...",
        "position": "...",
        "startDate": "...",
        "endDate": "...",
        "location": "...",
        "description": "...",
        "achievements": ["...", "..."]
      }
    ]

    Make the experience highly relevant to the job description.
    Use strong action verbs and include metrics/quantifiable achievements.
    `

    const response = await callGeminiAPIWithFallback(prompt, 1024)

    // Extract JSON from the response
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response")
    }

    const jsonStr = jsonMatch[0]
    const experiences = JSON.parse(jsonStr)

    return experiences
  } catch (error) {
    console.error("Error generating work experience:", error)
    throw error
  }
}

/**
 * Generate skills based on job description
 */
export async function generateSkills(jobDescription: string, skillKeywords = ""): Promise<SkillCategory[]> {
  try {
    const prompt = `
    You are an expert resume writer. Generate a comprehensive list of skills for a resume based on this job description:

    ${jobDescription}
    ${skillKeywords ? `Additional skill keywords to include: ${skillKeywords}` : ""}

    Organize the skills into 3-4 categories (e.g., Technical Skills, Soft Skills, Industry Knowledge).
    Each category should have 4-8 relevant skills.

    Format your response as a JSON array with the following structure:
    [
      {
        "name": "Category Name",
        "skills": [{"name": "Skill 1"}, {"name": "Skill 2"}]
      }
    ]

    Ensure the skills are highly relevant to the job description and would perform well in ATS systems.
    `

    const response = await callGeminiAPIWithFallback(prompt, 1024)

    // Extract JSON from the response
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response")
    }

    const jsonStr = jsonMatch[0]
    const skills = JSON.parse(jsonStr)

    return skills
  } catch (error) {
    console.error("Error generating skills:", error)
    throw error
  }
}

/**
 * Generate projects based on job description
 */
export async function generateProjects(jobDescription: string, skillKeywords = "", count = 2): Promise<Project[]> {
  try {
    const prompt = `
    You are an expert resume writer. Generate ${count} project entries for a resume based on this job description:

    ${jobDescription}
    ${skillKeywords ? `Skills to highlight: ${skillKeywords}` : ""}

    Each project should include:
    - Project name (creative but professional)
    - Description (1-2 sentences)
    - Technologies used
    - Start and end dates (recent)
    - 2-3 achievement-focused bullet points

    Format your response as a JSON array with the following structure:
    [
      {
        "name": "...",
        "description": "...",
        "technologies": "...",
        "link": "",
        "startDate": "...",
        "endDate": "...",
        "achievements": ["...", "..."]
      }
    ]

    Make the projects highly relevant to the job description and showcase the skills needed for the position.
    `

    const response = await callGeminiAPIWithFallback(prompt, 1024)

    // Extract JSON from the response
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response")
    }

    const jsonStr = jsonMatch[0]
    const projects = JSON.parse(jsonStr)

    return projects
  } catch (error) {
    console.error("Error generating projects:", error)
    throw error
  }
}
