/**
 * Achievement Enhancer Service
 *
 * This service uses the DeepSeek-Coder-33B-Instruct model (with Mistral-7B as fallback)
 * to enhance resume achievements by adding metrics, strong action verbs, and focusing on outcomes.
 */

// In a real implementation, this would use an actual API call to the model
// For now, we'll simulate the enhancement

// Define the model configuration
const MODEL_CONFIG = {
  name: "deepseek-coder-33b-instruct", // or "mistral-7b-instruct" as fallback
  temperature: 0.7,
  maxTokens: 1024,
  topP: 0.95,
}

// The prompt template for enhancing achievements
const ACHIEVEMENT_PROMPT_TEMPLATE = `
You are an expert resume writer specializing in transforming basic achievement descriptions into powerful, metrics-driven bullet points.

Instructions:
1. Transform each input bullet point into a more impactful statement
2. Start with strong action verbs
3. Add specific metrics and quantifiable results where possible
4. Focus on outcomes and impact, not just responsibilities
5. Keep each bullet point concise (under 25 words)
6. Maintain the original meaning and context

Input achievements:
{{achievements}}

Enhanced achievements:
`

/**
 * Enhances a list of achievements using the DeepSeek/Mistral model
 */
export async function enhanceAchievements(achievements: string[], context: string): Promise<string[]> {
  try {
    // Filter out empty achievements
    const validAchievements = achievements.filter((a) => a.trim().length > 0)

    if (validAchievements.length === 0) {
      return []
    }

    // In a real implementation, this would call the model API
    // For now, we'll simulate with a delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate enhanced achievements
    const enhancedAchievements = validAchievements.map((achievement) => {
      return enhanceAchievement(achievement, context)
    })

    return enhancedAchievements
  } catch (error) {
    console.error("Error enhancing achievements:", error)
    throw new Error("Failed to enhance achievements")
  }
}

/**
 * Enhances a single achievement
 */
function enhanceAchievement(achievement: string, context: string): string {
  // This would be replaced with actual model output
  // For now, we'll use a rule-based enhancement

  // Add strong action verbs
  const actionVerbs = [
    "Spearheaded",
    "Orchestrated",
    "Implemented",
    "Transformed",
    "Revolutionized",
    "Engineered",
    "Executed",
    "Pioneered",
    "Streamlined",
    "Catalyzed",
  ]

  // Add metrics if none exist
  const hasMetrics = /\d+%|\d+ percent|\d+x|\$\d+|\d+ times/i.test(achievement)

  let enhanced = achievement.trim()

  // Replace weak starting verbs
  enhanced = enhanced.replace(
    /^(helped|assisted|worked on|participated in|was responsible for)/i,
    () => actionVerbs[Math.floor(Math.random() * actionVerbs.length)],
  )

  // Add metrics if none exist
  if (!hasMetrics) {
    const metrics = [
      "resulting in 30% improvement",
      "increasing efficiency by 25%",
      "reducing costs by 20%",
      "boosting productivity by 40%",
      "generating $50K in additional revenue",
    ]

    if (!enhanced.endsWith(".")) enhanced += ","
    enhanced += " " + metrics[Math.floor(Math.random() * metrics.length)]
  }

  // Add role context if relevant
  if (context && !enhanced.toLowerCase().includes(context.toLowerCase())) {
    enhanced += ` as a ${context}`
  }

  // Ensure proper ending
  if (!enhanced.endsWith(".")) enhanced += "."

  return enhanced
}

/**
 * Generates the prompt for the DeepSeek/Mistral model
 */
function generatePrompt(achievements: string[], context: string): string {
  return `
You are an expert resume writer specializing in creating powerful achievement statements.
Transform the following achievement bullet points to be more impactful by:
1. Starting with strong action verbs
2. Adding specific metrics and quantifiable results
3. Focusing on outcomes and business impact
4. Using professional, concise language

Context: The person is a ${context}

Original achievements:
${achievements.map((a) => `- ${a}`).join("\n")}

Enhanced achievements (maintain the same number of bullet points):
`
}
