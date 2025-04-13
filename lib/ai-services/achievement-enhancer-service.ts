"use client"

import { generateStructuredData } from "./gemini-service"

type EnhancementStyle = "metrics" | "impact" | "technical" | "leadership"

/**
 * Enhance achievements using AI
 */
export async function enhanceAchievements(
  achievements: string[] = [],
  jobRole = "",
  style: EnhancementStyle = "metrics",
): Promise<string[]> {
  // Ensure achievements is an array and has at least one non-empty item
  if (!Array.isArray(achievements) || achievements.length === 0 || achievements.every((a) => !a || a.trim() === "")) {
    console.warn("No valid achievements provided to enhance")
    return []
  }

  try {
    const systemPrompt = `
    You are an expert resume writer specializing in creating powerful, impactful achievement statements.
    Your task is to transform basic achievement statements into compelling bullet points that will impress recruiters and pass ATS systems.
    `

    const styleGuide = getStyleGuide(style)

    // Filter out empty achievements
    const validAchievements = achievements.filter((a) => a && a.trim() !== "")

    const prompt = `
    Transform the following achievement statements for a ${jobRole || "professional"} role into more powerful, ${style}-focused bullet points.
    
    ${styleGuide}
    
    Here are the achievements to enhance:
    ${validAchievements.map((a, i) => `${i + 1}. ${a}`).join("\n")}
    
    Respond with an array of enhanced achievements in JSON format. Each enhanced achievement should be concise (under 25 words), start with a strong action verb, and include specific metrics where appropriate.
    `

    const response = await generateStructuredData<any>(prompt, systemPrompt, {
      temperature: 0.7,
      maxOutputTokens: 1024,
    })

    // Handle different response formats
    let enhancedAchievements: string[] = []

    // Case 1: Response is an array of objects with "achievement" property
    if (Array.isArray(response)) {
      enhancedAchievements = response.map((item) => {
        if (typeof item === "object" && item !== null && "achievement" in item) {
          return item.achievement
        }
        return String(item) // Fallback to string conversion
      })
    }
    // Case 2: Response has enhancedAchievements property
    else if (response && typeof response === "object" && "enhancedAchievements" in response) {
      if (Array.isArray(response.enhancedAchievements)) {
        enhancedAchievements = response.enhancedAchievements
      }
    }
    // Case 3: Response is an object with numbered properties
    else if (response && typeof response === "object") {
      const values = Object.values(response)
      if (values.length > 0) {
        enhancedAchievements = values.map((item) => String(item))
      }
    }

    // If we still don't have valid achievements, log the issue and return originals
    if (enhancedAchievements.length === 0) {
      console.warn("Could not extract enhanced achievements from response:", response)
      return validAchievements
    }

    return enhancedAchievements
  } catch (error) {
    console.error("Error enhancing achievements:", error)
    // Return the original achievements as a fallback
    return achievements.filter((a) => a && a.trim() !== "")
  }
}

function getStyleGuide(style: EnhancementStyle): string {
  switch (style) {
    case "metrics":
      return `
      Focus on QUANTIFIABLE RESULTS and METRICS. Include specific numbers, percentages, dollar amounts, or other measurable outcomes.
      Examples:
      - "Increased website traffic by 45% through implementation of SEO strategies"
      - "Reduced operational costs by $50,000 annually by streamlining procurement processes"
      `
    case "impact":
      return `
      Focus on BUSINESS IMPACT and VALUE CREATION. Emphasize how your actions benefited the company, customers, or stakeholders.
      Examples:
      - "Transformed customer onboarding process, resulting in 30% higher retention rates and improved satisfaction scores"
      - "Pioneered new marketing strategy that established company as industry thought leader and generated 25% more qualified leads"
      `
    case "technical":
      return `
      Focus on TECHNICAL EXPERTISE and IMPLEMENTATION details. Highlight specific technologies, methodologies, or technical challenges overcome.
      Examples:
      - "Architected and deployed microservices infrastructure using Docker and Kubernetes, improving system reliability by 99.9%"
      - "Implemented machine learning algorithms in Python to analyze customer data, identifying patterns that increased conversion rates by 15%"
      `
    case "leadership":
      return `
      Focus on LEADERSHIP QUALITIES and TEAM IMPACT. Emphasize how you led, mentored, or influenced others to achieve results.
      Examples:
      - "Led cross-functional team of 12 to deliver critical project under budget and 2 weeks ahead of schedule"
      - "Mentored 5 junior developers, accelerating their professional growth and reducing onboarding time by 40%"
      `
  }
}
