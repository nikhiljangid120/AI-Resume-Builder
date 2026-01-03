import type { ResumeData } from "@/lib/types"

// Use environment variable for API key
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""

// Helper function to safely call the Gemini API
async function callGeminiAPI(prompt: string, maxTokens = 1024): Promise<string> {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured")
    }

    // Using the Google Generative AI JavaScript SDK approach
    // This is a simplified version that works directly with fetch
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: maxTokens,
          },
        }),
      },
    )

    if (!response.ok) {
      let errorMessage = `HTTP error ${response.status}`
      try {
        const errorData = await response.json()
        console.error("Gemini API error details:", errorData)
        errorMessage = `Gemini API error: ${JSON.stringify(errorData)}`
      } catch (e) {
        // If we can't parse the error as JSON, use the status text
        errorMessage = `Gemini API error: ${response.statusText}`
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()

    // Extract text from the response based on the API structure
    if (
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.length > 0
    ) {
      return data.candidates[0].content.parts[0].text
    } else {
      console.error("Unexpected Gemini API response format:", data)
      throw new Error("Unexpected response format from Gemini API")
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    throw error
  }
}

// Implement a fallback mechanism for API calls
async function callGeminiAPIWithFallback(prompt: string, maxTokens = 1024): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured")
  }

  // List of models to try in order of preference
  const models = [
    "gemini-1.5-flash", // Try the latest model first
    "gemini-1.0-pro", // Then try older versions
    "gemini-pro",
  ]

  let lastError = null

  // Try each model in sequence
  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: maxTokens,
            },
          }),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.warn(`Error with model ${model}:`, errorData)
        lastError = new Error(`Gemini API error with model ${model}: ${JSON.stringify(errorData)}`)
        continue // Try the next model
      }

      const data = await response.json()

      // Extract text from the response
      if (
        data.candidates &&
        data.candidates.length > 0 &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts.length > 0
      ) {
        console.log(`Successfully used model: ${model}`)
        return data.candidates[0].content.parts[0].text
      } else {
        console.warn(`Unexpected response format from model ${model}:`, data)
        continue // Try the next model
      }
    } catch (error) {
      console.warn(`Error with model ${model}:`, error)
      lastError = error
      continue // Try the next model
    }
  }

  // If we've tried all models and none worked, throw the last error
  throw lastError || new Error("All Gemini API models failed")
}

/**
 * Generate a professional summary using Gemini AI
 */
async function generateProfessionalSummary(resumeData: ResumeData, jobDescription: string): Promise<string> {
  const prompt = `
  You are a professional resume writer. Generate a compelling professional summary for a resume based on the following information.

  Resume Data:
  ${JSON.stringify(resumeData)}

  Job Description (if available, use to tailor the summary):
  ${jobDescription}

  Focus on highlighting the candidate's key skills, experience, and career goals. The summary should be concise (3-5 sentences) and tailored to capture the attention of recruiters and hiring managers.
  
  Return ONLY the professional summary text without any additional text, markdown formatting, or code block indicators.
  `

  try {
    const response = await callGeminiAPIWithFallback(prompt, 512)
    // Clean up any markdown formatting
    return response.replace(/^```.*\n|```$/g, "").trim()
  } catch (error) {
    console.error("Error generating professional summary:", error)
    return "A highly motivated professional with a proven track record of success. Seeking a challenging role where I can leverage my skills and experience to contribute to the growth of a dynamic organization."
  }
}

/**
 * Enhance bullet points using Gemini AI
 */
async function enhanceBulletPoints(bulletPoints: string[], context: string): Promise<string[]> {
  const prompt = `
  You are a resume expert. Enhance the following bullet points to be more impactful and results-oriented.

  Context: ${context}

  Bullet Points:
  ${bulletPoints.join("\n")}

  Provide the enhanced bullet points. Each bullet point should start with a strong action verb and quantify achievements whenever possible.
  Return ONLY the bullet points without any additional text, markdown formatting, or code block indicators.
  `

  try {
    const response = await callGeminiAPIWithFallback(prompt, 512)
    // Clean up any markdown formatting and split into lines
    return response
      .replace(/^```.*\n|```$/g, "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
  } catch (error) {
    console.error("Error enhancing bullet points:", error)
    return bulletPoints
  }
}

/**
 * Analyze resume for ATS compatibility using Gemini AI
 */
async function analyzeResumeForATS(
  resumeData: ResumeData,
  jobDescription: string,
): Promise<{
  score: number
  feedback: string[]
  missingKeywords: string[]
}> {
  const prompt = `
  You are an expert resume analyst, specializing in Applicant Tracking Systems (ATS). Analyze the following resume data and job description to determine the resume's compatibility with ATS systems.

  Resume Data:
  ${JSON.stringify(resumeData)}

  Job Description:
  ${jobDescription}

  Provide a score (out of 100) indicating the ATS compatibility, a list of feedback points (3-5) to improve the resume, and a list of missing keywords (3-5) from the job description that should be added to the resume.
  Return the response in JSON format with the following keys: score, feedback, missingKeywords.
  `

  try {
    const response = await callGeminiAPIWithFallback(prompt, 512)
    const data = JSON.parse(response)

    return {
      score: data.score,
      feedback: data.feedback,
      missingKeywords: data.missingKeywords,
    }
  } catch (error) {
    console.error("Error analyzing resume for ATS:", error)
    return {
      score: 70,
      feedback: [
        "Make sure your resume includes relevant keywords from the job description.",
        "Quantify your achievements with specific metrics where possible.",
        "Ensure your resume is properly formatted for ATS systems.",
      ],
      missingKeywords: [],
    }
  }
}

/**
 * Generate tailoring tips using Gemini AI
 */
async function generateTailoringTips(resumeData: ResumeData, jobDescription: string): Promise<string[]> {
  const prompt = `
  You are a career advisor. Based on the following resume data and job description, provide 3-5 actionable tips to tailor the resume for the specific job.

  Resume Data:
  ${JSON.stringify(resumeData)}

  Job Description:
  ${jobDescription}

  Focus on highlighting relevant skills, experience, and achievements that align with the job requirements.
  Return ONLY the tips without any additional text, markdown formatting, or code block indicators.
  `

  try {
    const response = await callGeminiAPIWithFallback(prompt, 512)
    // Clean up any markdown formatting and split into lines
    return response
      .replace(/^```.*\n|```$/g, "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
  } catch (error) {
    console.error("Error generating tailoring tips:", error)
    return []
  }
}

// Function to analyze resume with Gemini API
async function analyzeResumeWithGemini(resumeText: string, jobDescription: string) {
  const prompt = `
  You are an expert resume analyst. Analyze the following resume text against the job description to determine ATS compatibility.
  
  Resume Text:
  ${resumeText}
  
  Job Description:
  ${jobDescription}
  
  Provide a detailed analysis including:
  1. An overall ATS compatibility score (0-100)
  2. Key missing keywords from the job description
  3. Feedback on how to improve the resume
  4. Suggestions for better formatting and content
  
  Return the response as a JSON object with the following structure:
  {
    "score": number,
    "missingKeywords": string[],
    "feedback": string[],
    "suggestions": string[]
  }
  `

  try {
    const response = await callGeminiAPIWithFallback(prompt, 1024)
    return JSON.parse(response)
  } catch (error) {
    console.error("Error analyzing resume with Gemini:", error)
    // Return robust fallback data instead of throwing
    return {
      score: 75,
      missingKeywords: ["keywords from job description"],
      feedback: ["Could not analyze resume deeply due to connection issue.", "PLease ensure your resume is detailed."],
      suggestions: ["Check internet connection", "Try again later"]
    }
  }
}

// Export all the necessary functions
export {
  callGeminiAPIWithFallback,
  analyzeResumeForATS,
  generateProfessionalSummary,
  enhanceBulletPoints,
  generateTailoringTips,
  analyzeResumeWithGemini,
}
