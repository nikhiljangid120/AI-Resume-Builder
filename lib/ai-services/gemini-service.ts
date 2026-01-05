"use client"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API client
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
const genAI = new GoogleGenerativeAI(apiKey)

// Get the generative model - updated to use the correct model name
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" })

export interface GenerationOptions {
  temperature?: number
  topK?: number
  topP?: number
  maxOutputTokens?: number
}

function checkApiKey() {
  if (!apiKey) {
    console.warn("NEXT_PUBLIC_GEMINI_API_KEY is not set. Using mock data.")
    return false
  }
  return true
}

/**
 * Generate text using the Gemini API
 */
export async function generateWithGemini(
  prompt: string,
  systemPrompt?: string,
  options: GenerationOptions = {},
): Promise<string> {
  if (!checkApiKey()) {
    throw new Error("API key is missing")
  }

  try {
    // Set generation config with defaults
    const generationConfig = {
      temperature: options.temperature ?? 0.7,
      topK: options.topK ?? 40,
      topP: options.topP ?? 0.95,
      maxOutputTokens: options.maxOutputTokens ?? 1024,
    }

    // Create chat session if system prompt is provided
    if (systemPrompt) {
      const chat = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [{ text: systemPrompt }],
          },
          {
            role: "model",
            parts: [{ text: "I'll help you with that." }],
          },
        ],
      })

      const result = await chat.sendMessage(prompt)
      const response = result.response
      return response.text()
    } else {
      // Use direct generation if no system prompt
      const result = await model.generateContent(prompt, generationConfig)
      const response = result.response
      return response.text()
    }
  } catch (error) {
    console.error("Error generating with Gemini:", error)

    // Try fallback model if primary model fails
    try {
      console.log("Attempting with fallback model gemini-pro...")
      const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" })
      const result = await fallbackModel.generateContent(prompt)
      const response = result.response
      return response.text()
    } catch (fallbackError) {
      console.error("Fallback model also failed:", fallbackError)
      throw new Error("Failed to generate content. Please try again.")
    }
  }
}

/**
 * Generate structured data using the Gemini API
 */
export async function generateStructuredData<T>(
  prompt: string,
  systemPrompt?: string,
  options: GenerationOptions = {},
): Promise<T> {
  if (!checkApiKey()) {
    return createMockData<T>()
  }

  try {
    const jsonPrompt = `${prompt}\n\nRespond ONLY with valid JSON. Do not include any explanations, markdown formatting, or text outside of the JSON structure.`

    const jsonResponse = await generateWithGemini(jsonPrompt, systemPrompt, {
      ...options,
      temperature: options.temperature ?? 0.2, // Lower temperature for structured data
    })

    // Extract JSON from the response
    const jsonMatch = jsonResponse.match(/```json\n([\s\S]*?)\n```/) ||
      jsonResponse.match(/```\n([\s\S]*?)\n```/) || [null, jsonResponse]

    const jsonString = jsonMatch[1] || jsonResponse

    try {
      return JSON.parse(jsonString.trim()) as T
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError)
      console.error("Raw response:", jsonResponse)

      // Return mock data based on the expected type
      return createMockData<T>()
    }
  } catch (error) {
    console.error("Error generating structured data:", error)

    // Return mock data if API call fails
    return createMockData<T>()
  }
}

/**
 * Create mock data when API calls fail
 */
function createMockData<T>(): T {
  // Basic mock data structure based on common resume data patterns
  const mockData: any = {
    personalInfo: {
      summary:
        "Experienced professional with a track record of success in delivering high-quality solutions. Skilled in problem-solving, communication, and team collaboration.",
    },
    skills: [
      {
        name: "Technical Skills",
        skills: [{ name: "JavaScript" }, { name: "React" }, { name: "Node.js" }],
      },
      {
        name: "Soft Skills",
        skills: [{ name: "Communication" }, { name: "Leadership" }, { name: "Problem Solving" }],
      },
    ],
    experience: [
      {
        company: "Tech Solutions Inc.",
        position: "Senior Developer",
        startDate: "Jan 2020",
        endDate: "Present",
        location: "Remote",
        description: "Leading development of web applications",
        achievements: [
          "Improved application performance by 40%",
          "Led team of 5 developers to deliver project ahead of schedule",
          "Implemented CI/CD pipeline reducing deployment time by 60%",
        ],
      },
    ],
    projects: [
      {
        name: "E-commerce Platform",
        description: "Built a scalable e-commerce solution",
        technologies: "React, Node.js, MongoDB",
        link: "",
        startDate: "2021",
        endDate: "2022",
        achievements: [
          "Implemented secure payment processing system",
          "Designed responsive UI improving mobile conversion rates by 25%",
          "Optimized database queries reducing load times by 30%",
        ],
      },
    ],
    enhancedAchievements: [
      "Spearheaded development initiatives resulting in 40% performance improvement",
      "Orchestrated team collaboration leading to ahead-of-schedule project delivery",
      "Engineered automated CI/CD pipeline reducing deployment time by 60%",
    ],
    score: 85,
    feedback: [
      "Consider adding more quantifiable achievements",
      "Highlight leadership experience more prominently",
      "Add more industry-specific keywords",
    ],
    missingKeywords: ["Docker", "Kubernetes", "AWS"],
    suggestions: [
      "Tailor your summary to highlight relevant experience",
      "Quantify achievements with specific metrics",
      "Add more technical skills relevant to the position",
    ],
  }

  // Return the appropriate section based on what seems to be expected
  return mockData as T
}

/**
 * Analyze text similarity using embeddings
 */
export async function analyzeTextSimilarity(text1: string, text2: string): Promise<number> {
  if (!checkApiKey()) return 70

  try {
    const prompt = `
    Compare the following two texts and rate their similarity on a scale from 0 to 100, where 0 means completely different and 100 means identical in meaning and content.
    
    Text 1:
    ${text1}
    
    Text 2:
    ${text2}
    
    Provide ONLY a number between 0 and 100 representing the similarity score.
    `

    const response = await generateWithGemini(prompt, undefined, { temperature: 0.1 })
    const scoreMatch = response.match(/\d+/)

    if (scoreMatch) {
      const score = Number.parseInt(scoreMatch[0], 10)
      return Math.min(100, Math.max(0, score)) // Ensure score is between 0-100
    }

    // Return a default score if extraction fails
    return 70
  } catch (error) {
    console.error("Error analyzing text similarity:", error)
    // Return a default score if API call fails
    return 70
  }
}

/**
 * Enhance bullet points using Gemini AI
 */
export async function enhanceBulletPoints(bulletPoints: string[], context: string): Promise<string[]> {
  try {
    // Ensure bulletPoints is an array
    if (!Array.isArray(bulletPoints)) {
      console.error("bulletPoints is not an array:", bulletPoints)
      return Array.isArray(bulletPoints) ? bulletPoints : [String(bulletPoints)]
    }

    // Filter out empty bullet points
    const validBulletPoints = bulletPoints.filter((point) => point && point.trim().length > 0)

    // If no valid bullet points, return the original array
    if (validBulletPoints.length === 0) {
      return bulletPoints
    }

    if (!checkApiKey()) {
      // Fallback logic
      const weakStartingVerbs = /^(helped|assisted|worked on|participated in|was responsible for)/i
      const strongVerbs = ["Spearheaded", "Implemented", "Executed", "Delivered", "Orchestrated"]
      return validBulletPoints.map(point => {
        if (weakStartingVerbs.test(point)) {
          const randomVerb = strongVerbs[Math.floor(Math.random() * strongVerbs.length)]
          return point.replace(weakStartingVerbs, randomVerb)
        }
        return point
      })
    }

    const prompt = `
    You are a resume expert. Enhance the following bullet points to be more impactful and results-oriented.

    Context: ${context}

    Bullet Points:
    ${validBulletPoints.map((point, i) => `${i + 1}. ${point}`).join("\n")}

    For each bullet point:
    1. Start with a strong action verb
    2. Add specific metrics and quantifiable results where possible
    3. Focus on outcomes and impact, not just responsibilities
    4. Keep each bullet point concise (under 25 words)
    5. Maintain the original meaning and context

    Provide ONLY the enhanced bullet points as a JSON array of strings.
    Format your response as: ["Enhanced bullet point 1", "Enhanced bullet point 2", ...]
    `

    const enhancedBulletPoints = await generateStructuredData<string[]>(prompt, undefined, {
      temperature: 0.7,
      maxOutputTokens: 1024,
    })

    return enhancedBulletPoints
  } catch (error) {
    console.error("Error enhancing bullet points:", error)

    // Fallback to basic enhancement if API call fails
    return bulletPoints.map((point) => {
      if (!point || point.trim().length === 0) return point

      // Simple enhancement logic for fallback
      let enhanced = point.trim()

      // Replace weak starting verbs with stronger ones
      const weakStartingVerbs = /^(helped|assisted|worked on|participated in|was responsible for)/i
      const strongVerbs = ["Spearheaded", "Implemented", "Executed", "Delivered", "Orchestrated"]

      if (weakStartingVerbs.test(enhanced)) {
        const randomVerb = strongVerbs[Math.floor(Math.random() * strongVerbs.length)]
        enhanced = enhanced.replace(weakStartingVerbs, randomVerb)
      }

      return enhanced
    })
  }
}

/**
 * Generate a professional summary using Gemini AI
 */
export async function generateProfessionalSummary(resumeData: any, jobDescription: string): Promise<string> {
  if (!checkApiKey()) {
    return "Experienced professional with a proven track record of delivering high-quality solutions. Skilled in problem-solving, communication, and team collaboration. Committed to continuous learning and applying innovative approaches to meet business objectives."
  }

  try {
    const prompt = `
    Create a compelling professional summary for a resume based on the following information:
    
    Resume Data:
    ${JSON.stringify(resumeData)}
    
    Job Description:
    ${jobDescription}
    
    The summary should:
    - Be 3-4 sentences long
    - Highlight relevant skills and experience
    - Include industry-specific keywords
    - Be written in first person
    - Be optimized for ATS systems
    
    Provide ONLY the professional summary text without any additional text or formatting.
    `

    return await generateWithGemini(prompt, undefined, {
      temperature: 0.7,
      maxOutputTokens: 512,
    })
  } catch (error) {
    console.error("Error generating professional summary:", error)

    // Return a fallback summary if API call fails
    return "Experienced professional with a proven track record of delivering high-quality solutions. Skilled in problem-solving, communication, and team collaboration. Committed to continuous learning and applying innovative approaches to meet business objectives."
  }
}

/**
 * Analyze resume for ATS compatibility using Gemini AI
 */
export async function analyzeResumeForATS(
  resumeData: any,
  jobDescription: string,
): Promise<{
  score: number
  feedback: string[]
  missingKeywords: string[]
}> {
  if (!checkApiKey()) {
    return {
      score: 70,
      feedback: [
        "Consider adding more keywords from the job description.",
        "Quantify your achievements with specific metrics where possible.",
        "Ensure your resume format is ATS-friendly with standard section headings.",
      ],
      missingKeywords: [],
    }
  }

  try {
    const prompt = `
    Analyze the following resume data against the job description for ATS compatibility:
    
    Resume Data:
    ${JSON.stringify(resumeData)}
    
    Job Description:
    ${jobDescription}
    
    Provide:
    1. An ATS compatibility score (0-100)
    2. 3-5 specific feedback points to improve the resume
    3. A list of important keywords from the job description missing in the resume
    
    Format your response as a JSON object with these keys: score, feedback (array of strings), missingKeywords (array of strings).
    `

    return await generateStructuredData<{
      score: number
      feedback: string[]
      missingKeywords: string[]
    }>(prompt, undefined, {
      temperature: 0.3,
      maxOutputTokens: 1024,
    })
  } catch (error) {
    console.error("Error analyzing resume for ATS:", error)

    // Return fallback data if API call fails
    return {
      score: 70,
      feedback: [
        "Consider adding more keywords from the job description.",
        "Quantify your achievements with specific metrics where possible.",
        "Ensure your resume format is ATS-friendly with standard section headings.",
      ],
      missingKeywords: [],
    }
  }
}

/**
 * Generate tailoring tips using Gemini AI
 */
export async function generateTailoringTips(resumeData: any, jobDescription: string): Promise<string[]> {
  if (!checkApiKey()) {
    return [
      "Customize your professional summary to directly address the job requirements.",
      "Reorganize your skills section to prioritize those mentioned in the job description.",
      "Quantify your achievements to demonstrate measurable impact in areas relevant to the position.",
    ]
  }

  try {
    const prompt = `
    Based on the following resume data and job description, provide 3-5 specific tips to tailor this resume for the job:
    
    Resume Data:
    ${JSON.stringify(resumeData)}
    
    Job Description:
    ${jobDescription}
    
    Focus on:
    - Highlighting relevant skills and experience
    - Addressing potential gaps
    - Emphasizing achievements that align with job requirements
    - Optimizing for ATS systems
    
    Format your response as a JSON array of strings, each containing one tailoring tip.
    `

    return await generateStructuredData<string[]>(prompt, undefined, {
      temperature: 0.7,
      maxOutputTokens: 1024,
    })
  } catch (error) {
    console.error("Error generating tailoring tips:", error)

    // Return fallback tips if API call fails
    return [
      "Customize your professional summary to directly address the job requirements.",
      "Reorganize your skills section to prioritize those mentioned in the job description.",
      "Quantify your achievements to demonstrate measurable impact in areas relevant to the position.",
    ]
  }
}

/**
 * Analyze resume strengths and weaknesses using Gemini AI
 */
export async function analyzeResumeStrengthsWeaknesses(
  resumeData: any,
  jobDescription: string,
): Promise<{
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  score: number
  keywordMatch: number
  readability: number
  impact: number
}> {
  if (!checkApiKey()) {
    return {
      strengths: ["Clear and concise formatting", "Well-organized skills section"],
      weaknesses: ["Lacks quantifiable achievements", "Could benefit from more industry-specific keywords"],
      opportunities: [
        "Add metrics to demonstrate impact",
        "Tailor your summary to match the job requirements",
        "Highlight leadership experience more prominently",
      ],
      score: 75,
      keywordMatch: 70,
      readability: 80,
      impact: 72,
    }
  }

  try {
    const prompt = `
    Analyze the following resume data against the job description to identify strengths, weaknesses, and opportunities for improvement:
    
    Resume Data:
    ${JSON.stringify(resumeData)}
    
    Job Description:
    ${jobDescription}
    
    Provide:
    1. 3-5 specific strengths of the resume
    2. 3-5 specific weaknesses of the resume
    3. 3-5 actionable opportunities to improve the resume
    4. An overall score (0-100) indicating the resume's effectiveness
    5. A keyword match score (0-100) indicating how well the resume matches the job description's keywords
    6. A readability score (0-100) indicating how easy the resume is to read and understand
    7. An impact score (0-100) indicating how well the resume demonstrates the candidate's impact and value
    
    Format your response as a JSON object with the following structure:
    {
      "strengths": ["Strength 1", "Strength 2", ...],
      "weaknesses": ["Weakness 1", "Weakness 2", ...],
      "opportunities": ["Opportunity 1", "Opportunity 2", ...],
      "score": number,
      "keywordMatch": number,
      "readability": number,
      "impact": number
    }
    `

    return await generateStructuredData<{
      strengths: string[]
      weaknesses: string[]
      opportunities: string[]
      score: number
      keywordMatch: number
      readability: number
      impact: number
    }>(prompt, undefined, {
      temperature: 0.5,
      maxOutputTokens: 1024,
    })
  } catch (error) {
    console.error("Error analyzing resume strengths and weaknesses:", error)

    // Return fallback data if API call fails
    return {
      strengths: ["Clear and concise formatting", "Well-organized skills section"],
      weaknesses: ["Lacks quantifiable achievements", "Could benefit from more industry-specific keywords"],
      opportunities: [
        "Add metrics to demonstrate impact",
        "Tailor your summary to match the job requirements",
        "Highlight leadership experience more prominently",
      ],
      score: 75,
      keywordMatch: 70,
      readability: 80,
      impact: 72,
    }
  }
}
